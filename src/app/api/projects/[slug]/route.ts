import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/mongodb';
import Project from '@/lib/models/Project';

function normalizeText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

type ProjectPayload = {
  [key: string]: unknown;
  images?: unknown;
  imagePublicIds?: unknown;
  mainImage?: unknown;
  mainImagePublicId?: unknown;
};

function normalizeProjectPayload(body: ProjectPayload, existing?: { imagePublicIds?: string[]; mainImagePublicId?: string }) {
  const images = Array.isArray(body.images)
    ? body.images.map(normalizeText).filter(Boolean).slice(0, 5)
    : [];

  const nextImagePublicIds = Array.isArray(body.imagePublicIds)
    ? body.imagePublicIds.map(normalizeText).slice(0, images.length)
    : existing?.imagePublicIds?.slice(0, images.length) || [];

  while (nextImagePublicIds.length < images.length) {
    nextImagePublicIds.push('');
  }

  const mainImage = normalizeText(body.mainImage) || images[0] || '';
  const mainImageIndex = images.indexOf(mainImage);
  const mainImagePublicId =
    normalizeText(body.mainImagePublicId) ||
    (mainImageIndex >= 0 ? nextImagePublicIds[mainImageIndex] : '') ||
    existing?.mainImagePublicId ||
    '';

  return {
    ...body,
    images,
    imagePublicIds: nextImagePublicIds,
    mainImage,
    mainImagePublicId: mainImagePublicId || undefined,
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const project = await Project.findOne({ slug: resolvedParams.slug });
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const body = (await request.json()) as ProjectPayload;
    const existingProject = await Project.findOne({ slug: resolvedParams.slug }).lean();

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const project = await Project.findOneAndUpdate(
      { slug: resolvedParams.slug },
      normalizeProjectPayload(body, existingProject as { imagePublicIds?: string[]; mainImagePublicId?: string }),
      { returnDocument: 'after', runValidators: true }
    );

    revalidatePath('/', 'layout');
    revalidatePath('/projects');
    revalidatePath(`/projects/${resolvedParams.slug}`);

    return NextResponse.json(project);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update project';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const project = await Project.findOneAndDelete({ slug: resolvedParams.slug });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    revalidatePath('/', 'layout');
    revalidatePath('/projects');

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
