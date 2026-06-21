import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET() {
  try {
    const db = await readDB();
    return NextResponse.json(db.schemes || {});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch schemes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json(); // expects { category, title, desc, eligibility, docs, link }
    const db = await readDB();
    
    if (!db.schemes) db.schemes = {};
    if (!db.schemes[data.category]) db.schemes[data.category] = [];

    const newScheme = {
      id: Date.now(),
      title: data.title,
      desc: data.desc,
      eligibility: data.eligibility,
      docs: Array.isArray(data.docs) ? data.docs : [data.docs],
      link: data.link || '#'
    };

    db.schemes[data.category].push(newScheme);
    await writeDB(db);

    return NextResponse.json(newScheme);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create scheme' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json(); // expects { id, oldCategory, newCategory, title, desc, eligibility, docs, link }
    const db = await readDB();
    
    if (!db.schemes) return NextResponse.json({ error: 'Schemes db empty' }, { status: 404 });

    // Find and remove from old category
    let foundScheme: any = null;
    const oldCat = data.oldCategory;
    
    if (db.schemes[oldCat]) {
      const idx = db.schemes[oldCat].findIndex((s: any) => s.id === data.id);
      if (idx !== -1) {
        foundScheme = db.schemes[oldCat][idx];
        db.schemes[oldCat].splice(idx, 1);
      }
    }

    // If not found in oldCategory, search everywhere
    if (!foundScheme) {
      for (const cat in db.schemes) {
        const idx = db.schemes[cat].findIndex((s: any) => s.id === data.id);
        if (idx !== -1) {
          foundScheme = db.schemes[cat][idx];
          db.schemes[cat].splice(idx, 1);
          break;
        }
      }
    }

    if (!foundScheme) {
      return NextResponse.json({ error: 'Scheme not found' }, { status: 404 });
    }

    // Build updated scheme
    const updatedScheme = {
      ...foundScheme,
      title: data.title ?? foundScheme.title,
      desc: data.desc ?? foundScheme.desc,
      eligibility: data.eligibility ?? foundScheme.eligibility,
      docs: Array.isArray(data.docs) ? data.docs : foundScheme.docs,
      link: data.link ?? foundScheme.link
    };

    // Insert into new category
    const finalCategory = data.newCategory || oldCat;
    if (!db.schemes[finalCategory]) db.schemes[finalCategory] = [];
    db.schemes[finalCategory].push(updatedScheme);

    await writeDB(db);
    return NextResponse.json(updatedScheme);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update scheme' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const db = await readDB();
    
    let deleted = false;
    for (const cat in db.schemes) {
      const idx = db.schemes[cat].findIndex((s: any) => s.id === id);
      if (idx !== -1) {
        db.schemes[cat].splice(idx, 1);
        deleted = true;
        break;
      }
    }

    if (deleted) {
      await writeDB(db);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Scheme not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete scheme' }, { status: 500 });
  }
}
