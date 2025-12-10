// ============================================
// API: /api/slide-cache
// Cache and retrieve generated slide HTML
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getSlideHtmlFromCache, saveSlideHtmlToCache } from '@/lib/blob';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deckId = searchParams.get('deckId');
    const slideIndex = searchParams.get('slideIndex');
    const contentHash = searchParams.get('contentHash');

    if (!deckId || slideIndex === null || !contentHash) {
      return NextResponse.json(
        { error: 'Missing required parameters: deckId, slideIndex, contentHash' },
        { status: 400 }
      );
    }

    const html = await getSlideHtmlFromCache(
      deckId,
      parseInt(slideIndex, 10),
      contentHash
    );

    if (html) {
      return NextResponse.json({ html, cached: true });
    }

    return NextResponse.json({ html: null, cached: false });
  } catch (error) {
    console.error('Error getting slide from cache:', error);
    return NextResponse.json(
      { error: 'Failed to get slide from cache', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { deckId, slideIndex, contentHash, html } = await request.json();

    if (!deckId || slideIndex === undefined || !contentHash || !html) {
      return NextResponse.json(
        { error: 'Missing required fields: deckId, slideIndex, contentHash, html' },
        { status: 400 }
      );
    }

    const url = await saveSlideHtmlToCache(deckId, slideIndex, contentHash, html);

    return NextResponse.json({ url, success: true });
  } catch (error) {
    console.error('Error saving slide to cache:', error);
    return NextResponse.json(
      { error: 'Failed to save slide to cache', details: String(error) },
      { status: 500 }
    );
  }
}
