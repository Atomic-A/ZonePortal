import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET() {
  try {
    const db = readDB();
    return NextResponse.json(db.polls || {});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch active poll' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { optionId } = await request.json();
    const db = readDB();
    
    if (!db.polls || !db.polls.options) {
      return NextResponse.json({ error: 'No active poll' }, { status: 404 });
    }

    const index = db.polls.options.findIndex((opt: any) => opt.id === optionId);
    if (index !== -1) {
      db.polls.options[index].votes = (db.polls.options[index].votes || 0) + 1;
      writeDB(db);
      return NextResponse.json(db.polls);
    }

    return NextResponse.json({ error: 'Option not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record vote' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json(); // expects { question, options: [{ id, text, votes }] }
    const db = readDB();

    const newOptions = data.options.map((opt: any, idx: number) => {
      return {
        id: opt.id || `opt-${idx + 1}-${Date.now()}`,
        text: opt.text,
        votes: typeof opt.votes === 'number' ? opt.votes : 0
      };
    });

    db.polls = {
      question: data.question,
      options: newOptions
    };
    
    writeDB(db);
    return NextResponse.json(db.polls);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update poll' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const db = readDB();
    db.polls = {
      question: "No active poll at the moment",
      options: []
    };
    writeDB(db);
    return NextResponse.json(db.polls);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear poll' }, { status: 500 });
  }
}
