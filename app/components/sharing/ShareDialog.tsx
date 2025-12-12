'use client';

// ============================================
// RIFF - Share Dialog Component
// Manage sharing and publishing for a deck
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  X,
  Copy,
  Check,
  Loader2,
  Globe,
  AlertTriangle,
  Trash2,
  Upload,
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

  // Fetch current share status
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

  // Fetch status when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen, fetchStatus]);

  // Create share link
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

  // Publish deck
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

  // Revoke share
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

  // Copy link to clipboard
  const handleCopy = async () => {
    if (status?.shareUrl) {
      await navigator.clipboard.writeText(status.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Format relative time
  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="
              fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50
              w-full max-w-md overflow-hidden
              bg-surface border border-border rounded-xl
              shadow-2xl shadow-black/30
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-text-tertiary" />
                <h2 className="text-base font-medium text-text-primary">
                  Share Presentation
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-surface-hover rounded-md text-text-tertiary hover:text-text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-text-tertiary" />
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-400 text-sm">{error}</p>
                  <button
                    onClick={fetchStatus}
                    className="mt-2 text-sm text-text-secondary hover:text-text-primary"
                  >
                    Try again
                  </button>
                </div>
              ) : !status?.isShared ? (
                // Not shared yet
                <div className="text-center py-4">
                  <Globe className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">
                    Share "{deckName}"
                  </h3>
                  <p className="text-sm text-text-secondary mb-6">
                    Create a public link to share your presentation with anyone.
                    You control when changes go live by publishing.
                  </p>
                  <button
                    onClick={handleCreateShare}
                    className="
                      px-4 py-2
                      bg-text-primary hover:bg-text-secondary
                      rounded-md text-background text-sm font-medium
                      transition-colors
                    "
                  >
                    Create Share Link
                  </button>
                </div>
              ) : (
                // Shared - show link and controls
                <div className="space-y-4">
                  {/* Share URL */}
                  <div>
                    <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
                      Share Link
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={status.shareUrl || ''}
                        className="
                          flex-1 px-3 py-2
                          bg-background border border-border rounded-md
                          text-sm text-text-primary
                          focus:outline-none
                        "
                      />
                      <button
                        onClick={handleCopy}
                        className="
                          px-3 py-2
                          bg-surface-hover hover:bg-border
                          border border-border rounded-md
                          text-text-primary text-sm
                          transition-colors
                          flex items-center gap-1.5
                        "
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 text-green-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Publish Status */}
                  {!status.isPublished ? (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-amber-200 font-medium">
                            Not published yet
                          </p>
                          <p className="text-xs text-amber-200/70 mt-0.5">
                            The link won't work until you publish. Click "Publish Now" to make your presentation visible.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Globe className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-green-200 font-medium">
                            Published
                          </p>
                          <p className="text-xs text-green-200/70 mt-0.5">
                            Last published {formatRelativeTime(status.publishedAt!)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={handlePublish}
                      disabled={publishing}
                      className="
                        flex-1 px-4 py-2
                        bg-text-primary hover:bg-text-secondary disabled:opacity-50
                        rounded-md text-background text-sm font-medium
                        transition-colors
                        flex items-center justify-center gap-2
                      "
                    >
                      {publishing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Publishing...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span>{status.isPublished ? 'Republish' : 'Publish Now'}</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleRevoke}
                      disabled={revoking}
                      className="
                        px-4 py-2
                        bg-red-500/10 hover:bg-red-500/20 disabled:opacity-50
                        border border-red-500/20
                        rounded-md text-red-400 text-sm font-medium
                        transition-colors
                        flex items-center gap-2
                      "
                    >
                      {revoking ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      <span>Revoke</span>
                    </button>
                  </div>

                  {/* Help text */}
                  <p className="text-xs text-text-tertiary text-center pt-2">
                    Changes you make in the editor won't affect the shared version until you republish.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
