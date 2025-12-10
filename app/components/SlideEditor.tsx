'use client';

// ============================================
// VIBE SLIDES - Slide Editor Component
// Minimal, Vercel-inspired design
// ============================================

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, FileText, Circle } from 'lucide-react';
import { useStore } from '@/lib/store';
import { parseSlideMarkdown } from '@/lib/parser';

interface SlideEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave: () => void;
  isSaving?: boolean;
}

export function SlideEditor({ content, onChange, onSave, isSaving = false }: SlideEditorProps) {
  const [localContent, setLocalContent] = useState(content);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { setParsedDeck } = useStore();

  const lastSavedContent = useRef(content);
  const isExternalUpdate = useRef(false);

  useEffect(() => {
    if (content !== lastSavedContent.current && !hasUnsavedChanges) {
      setLocalContent(content);
      lastSavedContent.current = content;
      setHasUnsavedChanges(false);
    }
  }, [content, hasUnsavedChanges]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const parsed = parseSlideMarkdown(localContent);
        setParsedDeck(parsed);
      } catch (e) {
        console.error('Parse error:', e);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localContent, setParsedDeck]);

  const handleChange = useCallback(
    (value: string) => {
      setLocalContent(value);
      setHasUnsavedChanges(value !== lastSavedContent.current);
      onChange(value);
    },
    [onChange]
  );

  const handleSave = useCallback(() => {
    onSave();
    lastSavedContent.current = localContent;
    setHasUnsavedChanges(false);
  }, [onSave, localContent]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  const slideCount = (localContent.match(/^---$/gm) || []).length;

  return (
    <div className="flex flex-col h-full bg-background rounded-lg overflow-hidden border border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
        <div className="flex items-center gap-3">
          <FileText className="w-4 h-4 text-text-tertiary" />
          <span className="text-sm text-text-secondary">Editor</span>
          <span className="text-xs text-text-quaternary px-1.5 py-0.5 bg-surface rounded">
            {slideCount} slides
          </span>
        </div>

        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1.5 text-warning text-xs"
            >
              <Circle className="w-2 h-2 fill-current" />
              <span>Unsaved</span>
            </motion.div>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            className={`
              flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm
              transition-all duration-fast
              ${
                hasUnsavedChanges
                  ? 'bg-text-primary text-background hover:bg-text-secondary'
                  : 'bg-surface text-text-quaternary cursor-not-allowed'
              }
            `}
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <textarea
          value={localContent}
          onChange={(e) => handleChange(e.target.value)}
          className="
            w-full h-full p-4
            bg-transparent text-text-primary font-mono text-sm
            resize-none outline-none
            placeholder:text-text-quaternary
            leading-relaxed
          "
          placeholder={`# Your Presentation Title
### Subtitle goes here

> Speaker notes start with >

---

# New Slide

**pause**

### Elements after pause appear on click

---

[image: Description of the image you want]

# Images are auto-generated!`}
          spellCheck={false}
        />
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-border">
        <p className="text-xs text-text-quaternary">
          <code className="text-text-tertiary">---</code> separate slides
          <span className="mx-2 text-border">·</span>
          <code className="text-text-tertiary">**pause**</code> for reveals
          <span className="mx-2 text-border">·</span>
          <code className="text-text-tertiary">`text`</code> to highlight
        </p>
      </div>
    </div>
  );
}
