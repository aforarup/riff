// ============================================
// API: /api/fonts/file
// Proxies actual font files (woff2, etc.) from fonts.gstatic.com
// Usage: /api/fonts/file?url=https://fonts.gstatic.com/s/inter/v13/...
// ============================================

import { NextRequest, NextResponse } from 'next/server';

// Cache font files for 1 year (they're immutable)
const CACHE_DURATION = 60 * 60 * 24 * 365;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fontUrl = searchParams.get('url');

  if (!fontUrl) {
    return NextResponse.json(
      { error: 'Missing url parameter' },
      { status: 400 }
    );
  }

  // Security: Only allow fonts.gstatic.com URLs
  if (!fontUrl.startsWith('https://fonts.gstatic.com/')) {
    return NextResponse.json(
      { error: 'Invalid font URL' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(fontUrl);

    if (!response.ok) {
      throw new Error(`Font fetch returned ${response.status}`);
    }

    const fontBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'font/woff2';

    return new NextResponse(fontBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': `public, max-age=${CACHE_DURATION}, immutable`,
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Font file proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch font file' },
      { status: 500 }
    );
  }
}
