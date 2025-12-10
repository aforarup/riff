'use client';

// ============================================
// VIBE SLIDES - Theme Customizer Component
// Minimal, Vercel-inspired design
// ============================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Sparkles, Loader2, X } from 'lucide-react';

interface ThemeCustomizerProps {
  currentPrompt: string;
  onGenerate: (prompt: string) => Promise<void>;
  isGenerating?: boolean;
}

const EXAMPLE_PROMPTS = [
  'Dark minimal with subtle cyan accents',
  'Warm and elegant with gold on deep burgundy',
  'Clean Apple-style with white space and subtle grays',
  'High contrast with stark black and white',
  'Soft pastels with gentle gradients',
  'Editorial magazine with sophisticated serifs',
];

export function ThemeCustomizer({
  currentPrompt,
  onGenerate,
  isGenerating = false,
}: ThemeCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState(currentPrompt);

  useEffect(() => {
    setPrompt(currentPrompt);
  }, [currentPrompt]);

  const handleGenerate = async () => {
    if (prompt.trim()) {
      await onGenerate(prompt.trim());
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
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
        <Palette className="w-4 h-4" />
        Theme
        {currentPrompt && (
          <span className="w-1.5 h-1.5 bg-text-primary rounded-full" />
        )}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.1 }}
              className="
                fixed right-4 top-16 z-50
                w-80 max-h-[calc(100vh-100px)] overflow-hidden
                bg-surface border border-border rounded-lg
                shadow-xl shadow-black/20
              "
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-text-tertiary" />
                  <span className="text-sm text-text-primary">Theme Generator</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-surface-hover rounded text-text-tertiary hover:text-text-primary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-180px)]">
                {/* Prompt input */}
                <div className="space-y-2">
                  <label className="text-xs text-text-tertiary uppercase tracking-wider">
                    Describe your theme
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Dark minimal with neon accents..."
                    className="
                      w-full h-20 px-3 py-2
                      bg-background border border-border rounded-md
                      text-text-primary text-sm placeholder:text-text-quaternary
                      focus:border-border-focus
                      outline-none resize-none
                    "
                  />
                </div>

                {/* Generate button */}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="
                    w-full flex items-center justify-center gap-2 px-4 py-2.5
                    bg-text-primary hover:bg-text-secondary
                    disabled:bg-surface disabled:text-text-quaternary
                    disabled:cursor-not-allowed
                    rounded-md text-background text-sm
                    transition-colors
                  "
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Theme
                    </>
                  )}
                </button>

                {/* Example prompts */}
                <div className="space-y-2">
                  <p className="text-xs text-text-quaternary uppercase tracking-wider">
                    Examples
                  </p>
                  <div className="space-y-1">
                    {EXAMPLE_PROMPTS.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => handleExampleClick(example)}
                        className="
                          w-full text-left px-2.5 py-2
                          hover:bg-surface-hover
                          rounded text-text-tertiary hover:text-text-secondary text-xs
                          transition-colors
                        "
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current theme */}
                {currentPrompt && (
                  <div className="p-3 bg-background border border-border rounded-md">
                    <p className="text-xs text-text-tertiary mb-1">
                      Active theme
                    </p>
                    <p className="text-xs text-text-secondary">{currentPrompt}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
