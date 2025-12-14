// ============================================
// API: /api/fonts
// Proxies Google Fonts CSS through our domain to bypass CSP restrictions
// Usage: /api/fonts?family=Inter:wght@400;500&family=Playfair+Display:wght@400
// ============================================

import { NextRequest, NextResponse } from 'next/server';

// Cache font CSS for 1 week (fonts don't change often)
const CACHE_DURATION = 60 * 60 * 24 * 7;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Get all family parameters (Google Fonts supports multiple)
  const families = searchParams.getAll('family');

  if (families.length === 0) {
    return NextResponse.json(
      { error: 'Missing family parameter' },
      { status: 400 }
    );
  }

  try {
    // Build Google Fonts URL
    const googleUrl = new URL('https://fonts.googleapis.com/css2');
    families.forEach(family => googleUrl.searchParams.append('family', family));
    googleUrl.searchParams.set('display', 'swap');

    // Fetch from Google Fonts with a browser-like user agent to get woff2
    const response = await fetch(googleUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Google Fonts returned ${response.status}`);
    }

    let css = await response.text();

    // Rewrite font URLs to proxy through our domain
    // Google Fonts returns URLs like: https://fonts.gstatic.com/s/inter/v13/...
    // We rewrite to: /api/fonts/file?url=https://fonts.gstatic.com/s/inter/v13/...
    css = css.replace(
      /url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/g,
      (match, url) => `url(/api/fonts/file?url=${encodeURIComponent(url)})`
    );

    return new NextResponse(css, {
      headers: {
        'Content-Type': 'text/css',
        'Cache-Control': `public, max-age=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`,
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Font proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fonts' },
      { status: 500 }
    );
  }
}
