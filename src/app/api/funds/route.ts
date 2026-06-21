import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET() {
  try {
    const db = readDB();
    const funds = db.funds || { totalBudget: 50000000, transactions: [] };
    
    // Calculate spent dynamically based on completed/in-progress transactions
    const totalSpent = (funds.transactions || []).reduce((acc: number, curr: any) => {
      // Typically we add up everything allocated or spent
      return acc + (Number(curr.amount) || 0);
    }, 0);

    const remaining = Math.max(0, (funds.totalBudget || 50000000) - totalSpent);

    return NextResponse.json({
      totalBudget: funds.totalBudget,
      totalSpent,
      remaining,
      transactions: funds.transactions || []
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch financial details' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json(); // expects { purpose, amount, status, date }
    const db = readDB();

    if (!db.funds) db.funds = { totalBudget: 50000000, transactions: [] };
    if (!db.funds.transactions) db.funds.transactions = [];

    const trxId = `TRX-${Math.floor(100 + Math.random() * 900)}`;
    const newTrx = {
      id: trxId,
      purpose: data.purpose,
      amount: Number(data.amount) || 0,
      status: data.status || 'Approved',
      date: data.date || new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    db.funds.transactions.unshift(newTrx);
    writeDB(db);

    return NextResponse.json(newTrx);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add transaction' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json(); // expects { id, purpose, amount, status, date } OR { totalBudget }
    const db = readDB();

    if (!db.funds) db.funds = { totalBudget: 50000000, transactions: [] };

    // Update totalBudget if provided
    if (typeof data.totalBudget === 'number' || typeof data.totalBudget === 'string') {
      db.funds.totalBudget = Number(data.totalBudget);
      writeDB(db);
      return NextResponse.json({ success: true, totalBudget: db.funds.totalBudget });
    }

    // Otherwise update transaction
    const index = db.funds.transactions.findIndex((t: any) => t.id === data.id);
    if (index !== -1) {
      db.funds.transactions[index] = {
        ...db.funds.transactions[index],
        purpose: data.purpose ?? db.funds.transactions[index].purpose,
        amount: data.amount !== undefined ? Number(data.amount) : db.funds.transactions[index].amount,
        status: data.status ?? db.funds.transactions[index].status,
        date: data.date ?? db.funds.transactions[index].date
      };
      writeDB(db);
      return NextResponse.json(db.funds.transactions[index]);
    }

    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update financial details' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const db = readDB();
    
    if (db.funds && db.funds.transactions) {
      db.funds.transactions = db.funds.transactions.filter((t: any) => t.id !== id);
      writeDB(db);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}
