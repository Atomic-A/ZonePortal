import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET() {
  try {
    const db = await readDB();
    return NextResponse.json(db.news);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newPost = await request.json();
    const db = await readDB();
    
    const postToSave = {
      ...newPost,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };

    db.news.unshift(postToSave); // Add to beginning
    await writeDB(db);

    return NextResponse.json(postToSave);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedPost = await request.json();
    const db = await readDB();
    
    const index = db.news.findIndex((p: any) => p.id === updatedPost.id);
    if (index !== -1) {
      db.news[index] = { ...db.news[index], ...updatedPost };
      await writeDB(db);
      return NextResponse.json(db.news[index]);
    }
    
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const db = await readDB();
    
    db.news = db.news.filter((p: any) => p.id !== id);
    await writeDB(db);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
