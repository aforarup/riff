// ============================================
// API: /api/credits
// Get user's credit balance
// ============================================

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getBalance, getTransactionHistory } from '@/lib/credits';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { balance } = await getBalance(session.user.id);

    // Get recent transactions for display
    const transactions = await getTransactionHistory(session.user.id, 10);

    return NextResponse.json({
      balance,
      transactions,
    });
  } catch (error) {
    console.error('Error fetching credits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch credits', details: String(error) },
      { status: 500 }
    );
  }
}
