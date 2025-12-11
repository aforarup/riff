'use client';

// ============================================
// VIBE SLIDES - Image Placeholder Component
// With upload, restyle, and restore functionality
// ============================================

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ImageIcon,
  Loader2,
  RefreshCw,
  Sparkles,
  Upload,
  Wand2,
  Undo2,
  X,
  Palette,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { IMAGE_STYLE_PRESETS } from '@/lib/types';

interface ImagePlaceholderProps {
  description: string;
  imageUrl?: string;
  status?: 'pending' | 'generating' | 'ready' | 'error';
  isPresenting?: boolean;
}

interface ImageMetadata {
  url: string;
  originalUrl?: string; // For restore after restyle
  source: 'generated' | 'uploaded' | 'restyled';
}

export function ImagePlaceholder({
  description,
  imageUrl,
  status = 'pending',
  isPresenting = false,
}: ImagePlaceholderProps) {
  const [imageData, setImageData] = useState<ImageMetadata | null>(
    imageUrl ? { url: imageUrl, source: 'generated' } : null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRestyling, setIsRestyling] = useState(false);
  const [isCheckingCache, setIsCheckingCache] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRestyleModal, setShowRestyleModal] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const cacheChecked = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { imageCache, cacheImage, imageStyle } = useStore();

  // Get the current slide background color from CSS variables
  const getBackgroundColor = () => {
    if (typeof window === 'undefined') return '#0a0a0a';
    return getComputedStyle(document.documentElement).getPropertyValue('--slide-bg').trim() || '#0a0a0a';
  };

  // Cache key for storing/retrieving images
  const cacheKey = imageStyle && imageStyle !== 'none'
    ? `${imageStyle}:${description}`
    : description;

  // Check if we have a cached URL
  const cachedUrl = imageCache[cacheKey] || imageData?.url;

  // Auto-check server cache on mount
  useEffect(() => {
    if (cacheChecked.current || cachedUrl) {
      setIsCheckingCache(false);
      return;
    }

    cacheChecked.current = true;

    const checkCache = async () => {
      try {
        const savedStyle = typeof window !== 'undefined'
          ? localStorage.getItem('vibe-slides-image-style') || 'none'
          : 'none';

        const response = await fetch('/api/image-cache?' + new URLSearchParams({
          description,
          styleId: savedStyle,
        }));

        if (response.ok) {
          const data = await response.json();
          if (data.url) {
            const actualCacheKey = savedStyle && savedStyle !== 'none'
              ? `${savedStyle}:${description}`
              : description;
            setImageData({ url: data.url, source: 'generated' });
            cacheImage(actualCacheKey, data.url);
          }
        }
      } catch (err) {
        console.error('Cache check failed:', err);
      } finally {
        setIsCheckingCache(false);
      }
    };

    checkCache();
  }, [description, cachedUrl, cacheImage]);

  // Generate new image
  const handleGenerate = async (forceRegenerate = false) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          styleId: imageStyle,
          backgroundColor: getBackgroundColor(),
          forceRegenerate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      if (data.url) {
        setImageData({ url: data.url, source: 'generated' });
        cacheImage(cacheKey, data.url);
      } else if (data.placeholder) {
        setError(data.message || 'Image generation not available');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle file upload
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', description);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      setImageData({ url: data.url, source: 'uploaded' });
      cacheImage(cacheKey, data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle restyle
  const handleRestyle = async () => {
    if (!cachedUrl || (!selectedPreset && !customPrompt.trim())) return;

    setIsRestyling(true);
    setError(null);

    try {
      const response = await fetch('/api/restyle-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: cachedUrl,
          styleId: selectedPreset || undefined,
          customPrompt: customPrompt.trim() || undefined,
          backgroundColor: getBackgroundColor(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to restyle image');
      }

      // Store original URL for restore
      setImageData({
        url: data.url,
        originalUrl: imageData?.originalUrl || cachedUrl,
        source: 'restyled',
      });
      cacheImage(cacheKey, data.url);
      setShowRestyleModal(false);
      setCustomPrompt('');
      setSelectedPreset(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restyle image');
    } finally {
      setIsRestyling(false);
    }
  };

  // Restore original image
  const handleRestore = () => {
    if (imageData?.originalUrl) {
      const originalUrl = imageData.originalUrl;
      setImageData({
        url: originalUrl,
        source: 'uploaded', // or 'generated', doesn't matter for restore
      });
      cacheImage(cacheKey, originalUrl);
    }
  };

  // Hidden file input
  const renderFileInput = () => (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
      onChange={handleUpload}
      className="hidden"
    />
  );

  // Restyle Modal
  const renderRestyleModal = () => (
    <AnimatePresence>
      {showRestyleModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowRestyleModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-neutral-900 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto border border-neutral-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Restyle Image</h3>
              </div>
              <button
                onClick={() => setShowRestyleModal(false)}
                className="p-1 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            {/* Preview */}
            <div className="mb-6 rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cachedUrl || ''}
                alt="Current image"
                className="w-full aspect-video object-cover"
              />
            </div>

            {/* Style Presets */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-300 mb-3">
                Select a Style Preset
              </label>
              <div className="grid grid-cols-2 gap-2">
                {IMAGE_STYLE_PRESETS.filter(p => p.id !== 'none').map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSelectedPreset(preset.id);
                      setCustomPrompt('');
                    }}
                    className={`p-3 text-left rounded-lg border transition-all ${
                      selectedPreset === preset.id
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-neutral-700 hover:border-neutral-600 bg-neutral-800/50'
                    }`}
                  >
                    <div className="font-medium text-sm text-white">{preset.name}</div>
                    <div className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
                      {preset.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Prompt */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Or Use Custom Prompt
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => {
                  setCustomPrompt(e.target.value);
                  if (e.target.value.trim()) setSelectedPreset(null);
                }}
                placeholder="e.g., Transform into a watercolor painting with soft edges..."
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 resize-none"
                rows={3}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowRestyleModal(false)}
                className="flex-1 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRestyle}
                disabled={isRestyling || (!selectedPreset && !customPrompt.trim())}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-neutral-700 disabled:text-neutral-500 text-white rounded-lg font-medium text-sm transition-colors"
              >
                {isRestyling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Restyling...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Apply Style
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // If we have an image, show it with action buttons
  if (cachedUrl) {
    return (
      <>
        {renderFileInput()}
        {renderRestyleModal()}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full aspect-video rounded-xl overflow-hidden group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cachedUrl}
            alt={description}
            className="absolute inset-0 w-full h-full object-contain"
            loading="lazy"
          />

          {/* Action buttons (hover) */}
          {!isPresenting && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {/* Regenerate */}
              <button
                onClick={() => handleGenerate(true)}
                disabled={isGenerating}
                className="flex items-center gap-1.5 px-3 py-2 bg-slide-accent text-slide-bg rounded-lg font-medium text-xs hover:bg-slide-accent/90 transition-colors disabled:opacity-50"
                title="Regenerate with AI"
              >
                {isGenerating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                Regenerate
              </button>

              {/* Upload */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg font-medium text-xs hover:bg-blue-500 transition-colors disabled:opacity-50"
                title="Upload your own image"
              >
                {isUploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                Upload
              </button>

              {/* Restyle */}
              <button
                onClick={() => setShowRestyleModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white rounded-lg font-medium text-xs hover:bg-purple-500 transition-colors"
                title="Apply a style to this image"
              >
                <Wand2 className="w-3.5 h-3.5" />
                Restyle
              </button>

              {/* Restore (only if restyled) */}
              {imageData?.originalUrl && (
                <button
                  onClick={handleRestore}
                  className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 text-white rounded-lg font-medium text-xs hover:bg-amber-500 transition-colors"
                  title="Restore original image"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  Restore
                </button>
              )}
            </div>
          )}

          {/* Source indicator badge */}
          {!isPresenting && imageData?.source && (
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                imageData.source === 'uploaded' ? 'bg-blue-600/80 text-white' :
                imageData.source === 'restyled' ? 'bg-purple-600/80 text-white' :
                'bg-neutral-600/80 text-white'
              }`}>
                {imageData.source === 'uploaded' ? 'Uploaded' :
                 imageData.source === 'restyled' ? 'Restyled' :
                 'Generated'}
              </span>
            </div>
          )}

          {/* Description tooltip */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-white/80 text-sm truncate">{description}</p>
          </div>
        </motion.div>
      </>
    );
  }

  // Show placeholder with generate/upload buttons
  return (
    <>
      {renderFileInput()}
      {renderRestyleModal()}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`
          relative w-full aspect-video rounded-xl
          bg-slide-surface/30 border-2 border-dashed border-slide-accent/30
          flex flex-col items-center justify-center gap-4
          ${isPresenting ? 'p-8' : 'p-4'}
        `}
      >
        {isCheckingCache ? (
          <>
            <Loader2 className={`${isPresenting ? 'w-12 h-12' : 'w-8 h-8'} text-slide-muted/50 animate-spin`} />
            <p className={`text-slide-muted/50 ${isPresenting ? 'text-lg' : 'text-xs'}`}>
              Loading...
            </p>
          </>
        ) : isGenerating || isUploading ? (
          <>
            <div className="relative">
              <Loader2 className={`${isPresenting ? 'w-16 h-16' : 'w-10 h-10'} text-slide-accent animate-spin`} />
              <Sparkles className="w-6 h-6 text-slide-accent absolute -top-1 -right-1 animate-pulse" />
            </div>
            <p className={`text-slide-muted ${isPresenting ? 'text-xl' : 'text-sm'}`}>
              {isUploading ? 'Uploading...' : 'Generating image...'}
            </p>
          </>
        ) : error ? (
          <>
            <ImageIcon className={`${isPresenting ? 'w-16 h-16' : 'w-10 h-10'} text-slide-muted/50`} />
            <p className={`text-red-400 ${isPresenting ? 'text-xl' : 'text-sm'} text-center max-w-md`}>
              {error}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleGenerate(false)}
                className="px-4 py-2 bg-slide-accent text-slide-bg rounded-lg font-medium text-sm hover:bg-slide-accent/90 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-500 transition-colors"
              >
                Upload Instead
              </button>
            </div>
          </>
        ) : (
          <>
            <ImageIcon className={`${isPresenting ? 'w-16 h-16' : 'w-10 h-10'} text-slide-muted/50`} />

            <p className={`text-slide-muted ${isPresenting ? 'text-xl' : 'text-sm'} text-center max-w-md`}>
              {description}
            </p>

            {!isPresenting && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleGenerate(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-slide-accent text-slide-bg rounded-lg font-medium text-sm hover:bg-slide-accent/90 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-500 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </>
  );
}
