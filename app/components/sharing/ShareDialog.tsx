'use client';

// ============================================
// RIFF - Share Dialog Component
// shadcn-inspired design
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Copy,
  Check,
  Loader2,
  Globe,
  Link2,
  Upload,
  Trash2,
} from 'lucide-react';

interface ShareDialogProps {
  deckId: string;
  deckName: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ShareStatus {
  isShared: boolean;
  shareToken: string | null;
  shareUrl: string | null;
  isPublished: boolean;
  publishedAt: string | null;
}

export function ShareDialog({ deckId, deckName, isOpen, onClose }: ShareDialogProps) {
  const [status, setStatus] = useState<ShareStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/decks/${deckId}/share`);
      if (!res.ok) throw new Error('Failed to fetch share status');
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      setError('Failed to load share status');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen, fetchStatus]);

  const handleCreateShare = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/decks/${deckId}/share`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to create share link');
      const data = await res.json();
      setStatus({
        isShared: true,
        shareToken: data.shareToken,
        shareUrl: data.shareUrl,
        isPublished: data.isPublished,
        publishedAt: data.publishedAt,
      });
    } catch (err) {
      setError('Failed to create share link');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      setPublishing(true);
      setError(null);
      const res = await fetch(`/api/decks/${deckId}/publish`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to publish');
      const data = await res.json();
      setStatus((prev) => prev ? {
        ...prev,
        isShared: true,
        shareToken: data.shareToken,
        shareUrl: data.shareUrl,
        isPublished: true,
        publishedAt: data.publishedAt,
      } : null);
    } catch (err) {
      setError('Failed to publish');
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  const handleRevoke = async () => {
    if (!confirm('This will disable the share link. Anyone with the link will no longer be able to view the presentation. Continue?')) {
      return;
    }
    try {
      setRevoking(true);
      setError(null);
      const res = await fetch(`/api/decks/${deckId}/share`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to revoke share');
      setStatus({
        isShared: false,
        shareToken: null,
        shareUrl: null,
        isPublished: false,
        publishedAt: null,
      });
    } catch (err) {
      setError('Failed to revoke share');
      console.error(err);
    } finally {
      setRevoking(false);
    }
  };

  const handleCopy = async () => {
    if (status?.shareUrl) {
      await navigator.clipboard.writeText(status.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/80"
            onClick={onClose}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-md bg-[#0a0a0a] border border-[#27272a] rounded-lg shadow-xl"
            >
              {/* Header */}
              <div className="flex flex-col gap-1.5 p-6 pb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white tracking-tight">
                    Share presentation
                  </h2>
                  <button
                    onClick={onClose}
                    className="rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
                <p className="text-sm text-[#a1a1aa]">
                  Anyone with this link can view your published presentation.
                </p>
              </div>

              {/* Content */}
              <div className="px-6 pb-6">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-[#a1a1aa]" />
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-red-400">{error}</p>
                    <button
                      onClick={fetchStatus}
                      className="mt-2 text-sm text-[#a1a1aa] hover:text-white transition-colors"
                    >
                      Try again
                    </button>
                  </div>
                ) : !status?.isShared ? (
                  // Not shared - create link
                  <div className="space-y-4">
                    <div className="flex items-center justify-center py-6">
                      <div className="w-12 h-12 rounded-full bg-[#27272a] flex items-center justify-center">
                        <Link2 className="w-6 h-6 text-[#a1a1aa]" />
                      </div>
                    </div>
                    <button
                      onClick={handleCreateShare}
                      className="w-full h-9 px-4 bg-white hover:bg-white/90 text-black text-sm font-medium rounded-md transition-colors"
                    >
                      Create share link
                    </button>
                  </div>
                ) : (
                  // Shared - show link and controls
                  <div className="space-y-4">
                    {/* Link input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={status.shareUrl || ''}
                        className="flex-1 h-9 px-3 bg-[#18181b] border border-[#27272a] rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#3f3f46]"
                      />
                      <button
                        onClick={handleCopy}
                        className="h-9 px-3 bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] rounded-md text-sm text-white transition-colors flex items-center gap-1.5"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        <span className="sr-only sm:not-sr-only">{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    {/* Status */}
                    <div className={`rounded-md border p-3 ${
                      status.isPublished
                        ? 'bg-emerald-500/10 border-emerald-500/20'
                        : 'bg-amber-500/10 border-amber-500/20'
                    }`}>
                      <div className="flex items-center gap-2">
                        {status.isPublished ? (
                          <>
                            <Globe className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-medium text-emerald-400">Live</span>
                            <span className="text-xs text-emerald-400/70">
                              · Published {formatRelativeTime(status.publishedAt!)}
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 rounded-full bg-amber-400" />
                            <span className="text-sm font-medium text-amber-400">Not published</span>
                          </>
                        )}
                      </div>
                      {!status.isPublished && (
                        <p className="text-xs text-amber-400/70 mt-1.5 ml-4">
                          Link won't work until you publish
                        </p>
                      )}
                    </div>

                    {/* Footer actions */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={handleRevoke}
                        disabled={revoking}
                        className="h-9 px-3 text-sm text-[#a1a1aa] hover:text-red-400 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {revoking ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Revoke
                      </button>
                      <button
                        onClick={handlePublish}
                        disabled={publishing}
                        className="h-9 px-4 bg-white hover:bg-white/90 text-black text-sm font-medium rounded-md transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {publishing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Publishing...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            {status.isPublished ? 'Republish' : 'Publish'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
