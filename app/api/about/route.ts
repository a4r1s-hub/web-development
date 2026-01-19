import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET about content (public)
export async function GET() {
  try {
    const db = getDb();

    const about = db.prepare('SELECT * FROM about LIMIT 1').get() as any;

    if (!about) {
      return NextResponse.json({
        about: {
          content: '',
          bio: '',
          skills: [],
        },
      });
    }

    // Parse skills JSON
    about.skills = about.skills ? JSON.parse(about.skills) : [];

    return NextResponse.json({ about });
  } catch (error) {
    console.error('[v0] Get about error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update about (requires auth)
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content, bio, skills } = await request.json();

    const db = getDb();

    // Check if about exists
    const existing = db.prepare('SELECT id FROM about LIMIT 1').get() as { id: number } | undefined;

    if (existing) {
      db.prepare(
        `
        UPDATE about
        SET content = ?, bio = ?, skills = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `
      ).run(content, bio, JSON.stringify(skills || []), existing.id);
    } else {
      db.prepare(
        `
        INSERT INTO about (content, bio, skills)
        VALUES (?, ?, ?)
      `
      ).run(content, bio, JSON.stringify(skills || []));
    }

    const about = db.prepare('SELECT * FROM about LIMIT 1').get() as any;
    about.skills = about.skills ? JSON.parse(about.skills) : [];

    return NextResponse.json({ about });
  } catch (error) {
    console.error('[v0] Update about error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
