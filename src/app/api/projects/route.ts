/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/mongodb';
import Project from '@/lib/models/Project';
import { getActiveMediaMap } from '@/lib/media';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const featured = searchParams.get('featured');

    const query: any = {};
    if (type) query.type = type;
    if (featured === 'true') query.featured = true;

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
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const project = await Project.create(body);
    revalidatePath('/', 'layout');
    revalidatePath('/projects');
    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
