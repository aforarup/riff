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

  // Better label: show "Style" when default, otherwise show the style name
  const buttonLabel = imageStyle === 'none' ? 'Style' : currentPreset.name;

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-1.5 px-2.5 py-1.5
          hover:bg-surface
          border border-border hover:border-border-hover
          rounded-md text-text-secondary hover:text-text-primary
          transition-all duration-fast text-xs
        "
        title="Image generation style"
      >
        <Image className="w-3.5 h-3.5" />
        <span>{buttonLabel}</span>
        <ChevronDown
          className={`w-3 h-3 text-text-tertiary transition-transform duration-fast ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown (opens upward) */}
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
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.1 }}
              className="
                absolute right-0 bottom-full mb-1.5 z-50
                w-64 overflow-hidden
                bg-[#0a0a0a] border border-[#27272a] rounded-lg
                shadow-xl shadow-black/30
              "
            >
              {/* Header */}
              <div className="px-3 py-2 border-b border-[#27272a]">
                <p className="text-xs text-[#71717a] uppercase tracking-wider">
                  Image Style
                </p>
              </div>

              {/* Options */}
              <div className="p-1.5 max-h-64 overflow-y-auto">
                {IMAGE_STYLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelect(preset.id)}
                    className={`
                      w-full flex items-start gap-3 px-2.5 py-2 rounded-md text-left
                      transition-colors
                      ${
                        preset.id === imageStyle
                          ? 'bg-white/10'
                          : 'hover:bg-white/5'
                      }
                    `}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm ${
                            preset.id === imageStyle
                              ? 'text-white'
                              : 'text-[#a1a1aa]'
                          }`}
                        >
                          {preset.name}
                        </span>
                        {preset.id === imageStyle && (
                          <Check className="w-3.5 h-3.5 text-white" />
                        )}
                      </div>
                      <p className="text-xs text-[#71717a] mt-0.5 line-clamp-2">
                        {preset.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Footer hint */}
              <div className="px-3 py-2 border-t border-[#27272a]">
                <p className="text-xs text-[#52525b]">
                  Applies to all new generated images
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
