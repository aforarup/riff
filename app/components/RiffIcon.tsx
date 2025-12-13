// ============================================
// RIFF - Stacked Pages Icon Component
// The new Riff brand icon - two overlapping slides
// ============================================

interface RiffIconProps {
  size?: number;
  className?: string;
  /** Primary (front page) color/opacity */
  primaryColor?: string;
  /** Secondary (back page) color/opacity */
  secondaryColor?: string;
}

/**
 * Riff brand icon - stacked pages design
 * Represents the presentation/slide deck concept
 */
export function RiffIcon({
  size = 24,
  className = '',
  primaryColor = 'rgba(255, 255, 255, 0.9)',
  secondaryColor = 'rgba(255, 255, 255, 0.5)',
}: RiffIconProps) {
  // Scale factor from original 512pt viewBox
  const scale = size / 512;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      className={className}
      style={{ display: 'block' }}
    >
      {/* Back page - slightly offset and faded */}
      <path
        d="M451.755 105.052L415.896 377.78C413.449 396.325 396.381 409.253 377.968 406.806L358.815 404.244L323.072 132.731C320.018 109.916 300.503 92.717 277.455 92.717C275.5 92.717 273.43 92.8328 271.476 93.0789L196.951 102.836L200.975 71.9718C203.422 53.4271 220.374 40.3837 238.903 42.8156L422.597 67.0932C441.141 69.5542 454.199 86.5066 451.753 105.051L451.755 105.052Z"
        fill={secondaryColor}
      />
      {/* Front page - main visible slide */}
      <path
        d="M346.87 407.08L310.982 134.352C308.55 115.836 291.554 102.793 273.039 105.225L89.3715 129.386C70.8557 131.819 57.8122 148.814 60.2441 167.329L96.132 440.057C98.5641 458.573 115.56 471.616 134.075 469.184L317.743 445.023C336.258 442.591 349.302 425.595 346.87 407.08Z"
        fill={primaryColor}
      />
    </svg>
  );
}

/**
 * Inline SVG markup for use in Next.js OG images (ImageResponse)
 * Since ImageResponse doesn't support React components, use this for OG/Twitter images
 */
export function getRiffIconSVG(size: number, primaryColor: string, secondaryColor: string) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 512 512',
    children: [
      // Back page
      {
        type: 'path',
        d: 'M451.755 105.052L415.896 377.78C413.449 396.325 396.381 409.253 377.968 406.806L358.815 404.244L323.072 132.731C320.018 109.916 300.503 92.717 277.455 92.717C275.5 92.717 273.43 92.8328 271.476 93.0789L196.951 102.836L200.975 71.9718C203.422 53.4271 220.374 40.3837 238.903 42.8156L422.597 67.0932C441.141 69.5542 454.199 86.5066 451.753 105.051L451.755 105.052Z',
        fill: secondaryColor,
      },
      // Front page
      {
        type: 'path',
        d: 'M346.87 407.08L310.982 134.352C308.55 115.836 291.554 102.793 273.039 105.225L89.3715 129.386C70.8557 131.819 57.8122 148.814 60.2441 167.329L96.132 440.057C98.5641 458.573 115.56 471.616 134.075 469.184L317.743 445.023C336.258 442.591 349.302 425.595 346.87 407.08Z',
        fill: primaryColor,
      },
    ],
  };
}
