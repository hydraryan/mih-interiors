/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/mongodb';
import Project from '@/lib/models/Project';
import { getActiveMediaMap } from '@/lib/media';

export const dynamic = 'force-dynamic';

function normalizeText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeProjectPayload(body: any, existing?: { imagePublicIds?: string[]; mainImagePublicId?: string }) {
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

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const featured = searchParams.get('featured');

    const query: any = {};
    if (type) query.type = type;
    if (featured === 'true') query.featured = true;

    // In development or if specifically requested, show drafts
    // Otherwise default to published
    if (!process.env.SHOW_DRAFTS && process.env.NODE_ENV === 'production') {
      // Use $ne: 'draft' to include existing projects that might not have the field yet
      query.publishStatus = { $ne: 'draft' };
    }

    const [projects, media] = await Promise.all([
      Project.find(query).sort({ order: 1, createdAt: -1 }).lean(),
      getActiveMediaMap(),
    ]);

    const visibleProjects = projects
      .map((project) => {
        const images = media.filter(project.images || []);
        const mainImage = media.isVisible(project.mainImage)
          ? project.mainImage
          : images[0] || media.resolve(project.mainImage);

        return {
          ...project,
          mainImage,
          images: images.length ? images : [mainImage].filter(Boolean),
        };
      })
      .filter((project) => project.mainImage);

    return NextResponse.json(visibleProjects);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch projects', details: process.env.NODE_ENV === 'production' ? undefined : 'See server logs for details' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const project = await Project.create(normalizeProjectPayload(body));
    revalidatePath('/', 'layout');
    revalidatePath('/projects');
    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
