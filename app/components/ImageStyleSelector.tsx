'use client';

// ============================================
// VIBE SLIDES - Image Style Selector Component
// Minimal, Vercel-inspired design
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, ChevronDown, Check } from 'lucide-react';
import { useStore } from '@/lib/store';
import { IMAGE_STYLE_PRESETS, ImageStyleId } from '@/lib/types';

export function ImageStyleSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { imageStyle, setImageStyle } = useStore();

  const currentPreset = IMAGE_STYLE_PRESETS.find((p) => p.id === imageStyle) || IMAGE_STYLE_PRESETS[0];

  const handleSelect = (styleId: ImageStyleId) => {
    setImageStyle(styleId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2 px-3 py-2
          hover:bg-surface
          border border-border hover:border-border-hover
          rounded-md text-text-secondary hover:text-text-primary
          transition-all duration-fast text-sm
        "
      >
        <Image className="w-4 h-4" />
        <span className="hidden sm:inline">{currentPreset.name}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-text-tertiary transition-transform duration-fast ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.1 }}
              className="
                absolute right-0 top-full mt-1.5 z-50
                w-64 overflow-hidden
                bg-surface border border-border rounded-lg
                shadow-xl shadow-black/20
              "
            >
              {/* Header */}
              <div className="px-3 py-2 border-b border-border">
                <p className="text-xs text-text-tertiary uppercase tracking-wider">
                  Image Style
                </p>
              </div>

              {/* Options */}
              <div className="p-1.5 max-h-80 overflow-y-auto">
                {IMAGE_STYLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelect(preset.id)}
                    className={`
                      w-full flex items-start gap-3 px-2.5 py-2 rounded-md text-left
                      transition-colors
                      ${
                        preset.id === imageStyle
                          ? 'bg-surface-hover'
                          : 'hover:bg-surface-hover'
                      }
                    `}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm ${
                            preset.id === imageStyle
                              ? 'text-text-primary'
                              : 'text-text-secondary'
                          }`}
                        >
                          {preset.name}
                        </span>
                        {preset.id === imageStyle && (
                          <Check className="w-3.5 h-3.5 text-text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-text-quaternary mt-0.5 line-clamp-2">
                        {preset.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Footer hint */}
              <div className="px-3 py-2 border-t border-border">
                <p className="text-xs text-text-quaternary">
                  Style applies to all new images in this session
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
