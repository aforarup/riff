'use client';

// ============================================
// VIBE SLIDES - Presenter Client Component
// ============================================

import { Presenter } from '@/components/Presenter';
import { ParsedDeck, SlideRenderMode } from '@/lib/types';

interface PresenterClientProps {
  deck: ParsedDeck;
  deckId: string;
  initialSlide: number;
  themeCSS?: string;
  themePrompt?: string;
  initialRenderMode?: SlideRenderMode;
  isSharedView?: boolean;
}

export function PresenterClient({
  deck,
  deckId,
  initialSlide,
  themeCSS,
  themePrompt,
  initialRenderMode = 'standard',
  isSharedView = false,
}: PresenterClientProps) {
  return (
    <Presenter
      deck={deck}
      deckId={deckId}
      initialSlide={initialSlide}
      themeCSS={themeCSS}
      themePrompt={themePrompt}
      initialRenderMode={initialRenderMode}
      isSharedView={isSharedView}
    />
  );
}
