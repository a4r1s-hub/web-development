import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();

    const project = db
      .prepare(
        `
      SELECT p.*, pc.name as category_name, pc.slug as category_slug
      FROM projects p
      JOIN project_categories pc ON p.category_id = pc.id
      WHERE p.id = ?
    `
      )
      .get(id) as any;

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Parse JSON fields
    project.image_urls = project.image_urls ? JSON.parse(project.image_urls) : [];
    project.tags = project.tags ? JSON.parse(project.tags) : [];
    project.featured = Boolean(project.featured);

    return NextResponse.json({ project });
  } catch (error) {
    console.error('[v0] Get project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update project (requires auth)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
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

    const db = getDb();

    db.prepare(
      `
      UPDATE projects
      SET title = ?, description = ?, category_id = ?, project_url = ?,
          thumbnail_url = ?, image_urls = ?, tags = ?, featured = ?,
          order_index = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `
    ).run(
      title,
      description || null,
      category_id,
      project_url || null,
      thumbnail_url || null,
      JSON.stringify(image_urls || []),
      JSON.stringify(tags || []),
      featured ? 1 : 0,
      order_index || 0,
      id
    );

    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);

    return NextResponse.json({ project });
  } catch (error) {
    console.error('[v0] Update project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE project (requires auth)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const db = getDb();

    db.prepare('DELETE FROM projects WHERE id = ?').run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[v0] Delete project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
