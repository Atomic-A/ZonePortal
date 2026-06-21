import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET() {
  try {
    const db = readDB();
    // Return all admins. In a production app we would hash passwords,
    // but for local administration, we return the list.
    return NextResponse.json(db.admins || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admin users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const db = readDB();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    if (!db.admins) db.admins = [];

    // Check for duplicate username
    const exists = db.admins.some((a: any) => a.username.toLowerCase() === username.toLowerCase());
    if (exists) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    const newAdmin = { username, password };
    db.admins.push(newAdmin);
    writeDB(db);

    return NextResponse.json({ success: true, user: { username } });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create admin user' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { username } = await request.json();
    const db = readDB();

    if (!db.admins || db.admins.length === 0) {
      return NextResponse.json({ error: 'No admin users found' }, { status: 404 });
    }

    // Lockout protection: Do not allow deleting the last remaining admin
    if (db.admins.length <= 1) {
      return NextResponse.json({ error: 'Cannot delete the last remaining admin user!' }, { status: 400 });
    }

    const exists = db.admins.some((a: any) => a.username === username);
    if (!exists) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    db.admins = db.admins.filter((a: any) => a.username !== username);
    writeDB(db);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete admin user' }, { status: 500 });
  }
}
