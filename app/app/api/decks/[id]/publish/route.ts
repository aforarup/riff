// ============================================
// API: /api/decks/[id]/publish
// Publish current deck state to the shared view
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getDeckContent, getTheme } from '@/lib/blob';
import { nanoid } from 'nanoid';

// POST: Publish current deck state
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deckId = params.id;

    // Get deck with ownership check
    const deck = await prisma.deck.findFirst({
      where: {
        id: deckId,
        ownerId: session.user.id,
      },
    });

    if (!deck) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
    }

    // Get current content from blob
    const content = await getDeckContent(deck.blobUrl);
    if (!content) {
      return NextResponse.json(
        { error: 'Deck content not found' },
        { status: 404 }
      );
    }

    // Get current theme (may be null)
    const theme = await getTheme(session.user.id, deckId);

    // If no share token exists, create one
    let shareToken = deck.shareToken;
    if (!shareToken) {
      shareToken = nanoid(12);
    }

    // Update deck with published content
    const updatedDeck = await prisma.deck.update({
      where: { id: deckId },
      data: {
        shareToken,
        publishedContent: content,
        publishedTheme: theme ? JSON.stringify(theme) : null,
        publishedAt: new Date(),
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || 'https://www.riff.im';
    return NextResponse.json({
      success: true,
      shareToken: updatedDeck.shareToken,
      shareUrl: `${baseUrl}/p/${updatedDeck.shareToken}`,
      publishedAt: updatedDeck.publishedAt?.toISOString(),
    });
  } catch (error) {
    console.error('Error publishing deck:', error);
    return NextResponse.json(
      { error: 'Failed to publish deck' },
      { status: 500 }
    );
  }
}
