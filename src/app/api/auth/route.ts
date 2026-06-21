import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const db = await readDB();

    const matchedAdmin = (db.admins || []).find(
      (a: any) => a.username === username && a.password === password
    );

    if (matchedAdmin) {
      const response = NextResponse.json({ success: true });
      
      // Set secure HTTP-only cookie as session-only (expires when browser is closed)
      response.cookies.set({
        name: 'admin_token',
        value: 'authenticated',
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json({ success: true });
    
    // Clear the secure cookie by setting its maxAge to 0 and expiring it
    response.cookies.set({
      name: 'admin_token',
      value: '',
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      expires: new Date(0)
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log out' }, { status: 500 });
  }
}
