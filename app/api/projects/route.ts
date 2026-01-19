import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET all projects (public)
export async function GET(request: NextRequest) {
  try {
    const db = getDb();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    let query = `
      SELECT p.*, pc.name as category_name, pc.slug as category_slug
      FROM projects p
      JOIN project_categories pc ON p.category_id = pc.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (category) {
      query += ' AND pc.slug = ?';
      params.push(category);
    }

    if (featured === 'true') {
      query += ' AND p.featured = 1';
    }

    query += ' ORDER BY p.order_index ASC, p.created_at DESC';

    const projects = db.prepare(query).all(...params);

    // Parse JSON fields
    const formattedProjects = projects.map((project: any) => ({
      ...project,
      image_urls: project.image_urls ? JSON.parse(project.image_urls) : [],
      tags: project.tags ? JSON.parse(project.tags) : [],
      featured: Boolean(project.featured),
    }));

    return NextResponse.json({ projects: formattedProjects });
  } catch (error) {
    console.error('[v0] Get projects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create project (requires auth)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      category_id,
      project_url,
      thumbnail_url,
      image_urls,
      tags,
      featured,
      order_index,
    } = body;

    if (!title || !category_id) {
      return NextResponse.json(
        { error: 'Title and category are required' },
        { status: 400 }
      );
    }

    const db = getDb();

    const result = db
      .prepare(
        `
      INSERT INTO projects (
        title, description, category_id, project_url, thumbnail_url,
        image_urls, tags, featured, order_index
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
      )
      .run(
        title,
        description || null,
        category_id,
        project_url || null,
        thumbnail_url || null,
        JSON.stringify(image_urls || []),
        JSON.stringify(tags || []),
        featured ? 1 : 0,
        order_index || 0
      );

    const project = db
      .prepare('SELECT * FROM projects WHERE id = ?')
      .get(result.lastInsertRowid);

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('[v0] Create project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
