import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET() {
  try {
    const db = await readDB();
    return NextResponse.json(db.requests || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const db = await readDB();
    
    // Auto-generate Request ID
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newRequest = {
      id: `REQ-${year}-${randomNum}`,
      name: data.name || 'Anonymous',
      type: data.type || 'Grievance Letter',
      ward: parseInt(data.ward) || 1,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'Pending',
      description: data.description || ''
    };

    if (!db.requests) db.requests = [];
    db.requests.unshift(newRequest);
    await writeDB(db);

    return NextResponse.json(newRequest);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json(); // expects { id, status }
    const db = await readDB();
    
    const index = db.requests.findIndex((r: any) => r.id === data.id);
    if (index !== -1) {
      db.requests[index].status = data.status;
      await writeDB(db);
      return NextResponse.json(db.requests[index]);
    }
    
    return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const db = await readDB();
    
    db.requests = db.requests.filter((r: any) => r.id !== id);
    await writeDB(db);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete request' }, { status: 500 });
  }
}
