import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET all categories (public)
export async function GET() {
  try {
    const db = getDb();

    const categories = db.prepare('SELECT * FROM project_categories ORDER BY name').all();

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('[v0] Get categories error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
