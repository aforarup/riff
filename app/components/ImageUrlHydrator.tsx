'use client';

// ============================================
// RIFF - Image URL Hydrator
// Hydrates localStorage with published image URLs
// for shared presentation viewing
// ============================================

import { useEffect } from 'react';

interface ImageUrlHydratorProps {
  imageUrls: Record<string, string>;
}

export function ImageUrlHydrator({ imageUrls }: ImageUrlHydratorProps) {
  useEffect(() => {
    if (typeof window === 'undefined' || !imageUrls) return;

    // Hydrate localStorage with published image URLs
    for (const [key, url] of Object.entries(imageUrls)) {
      if (key === '__imageStyle__') {
        // Set the image style that was used when publishing
        localStorage.setItem('vibe-slides-image-style', url);
      } else if (key.startsWith('vibe-image-')) {
        // Set the image URL for this slot
        localStorage.setItem(key, url);
      }
    }
  }, [imageUrls]);

  // This component doesn't render anything
  return null;
}
