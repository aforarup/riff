import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Riff - Turn your notes to stunning decks';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  // Load Playfair Display font from fontsource CDN (reliable for edge runtime)
  const playfairBold = fetch(
    'https://cdn.jsdelivr.net/fontsource/fonts/playfair-display@latest/latin-700-normal.ttf'
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#030303',
          position: 'relative',
        }}
      >
        {/* Grid pattern - matching landing hero */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            mask: 'linear-gradient(to bottom, black 0%, transparent 70%)',
          }}
        />

        {/* Logo - centered */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            marginBottom: 48,
          }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 512 512"
            fill="none"
          >
            {/* Back page */}
            <path
              d="M451.755 105.052L415.896 377.78C413.449 396.325 396.381 409.253 377.968 406.806L358.815 404.244L323.072 132.731C320.018 109.916 300.503 92.717 277.455 92.717C275.5 92.717 273.43 92.8328 271.476 93.0789L196.951 102.836L200.975 71.9718C203.422 53.4271 220.374 40.3837 238.903 42.8156L422.597 67.0932C441.141 69.5542 454.199 86.5066 451.753 105.051L451.755 105.052Z"
              fill="rgba(255, 255, 255, 0.35)"
            />
            {/* Front page */}
            <path
              d="M346.87 407.08L310.982 134.352C308.55 115.836 291.554 102.793 273.039 105.225L89.3715 129.386C70.8557 131.819 57.8122 148.814 60.2441 167.329L96.132 440.057C98.5641 458.573 115.56 471.616 134.075 469.184L317.743 445.023C336.258 442.591 349.302 425.595 346.87 407.08Z"
              fill="rgba(255, 255, 255, 0.7)"
            />
          </svg>
          <span
            style={{
              fontSize: 72,
              fontFamily: 'Playfair Display',
              fontWeight: 700,
              color: '#fafafa',
              letterSpacing: '-0.02em',
            }}
          >
            Riff
          </span>
        </div>

        {/* Hero text - centered */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 70,
              fontFamily: 'Playfair Display',
              fontWeight: 700,
              color: '#fafafa',
              letterSpacing: '-0.02em',
              lineHeight: 0.95,
            }}
          >
            Turn your notes
          </div>
          <div
            style={{
              fontSize: 70,
              fontFamily: 'Playfair Display',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.25)',
              letterSpacing: '-0.02em',
              lineHeight: 0.95,
              marginTop: 8,
            }}
          >
            to a stunning deck.
          </div>
        </div>

        {/* Domain - bottom right */}
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            right: 64,
            fontSize: 24,
            color: '#ffffff',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          riff.im
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Playfair Display',
          data: await playfairBold,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}
