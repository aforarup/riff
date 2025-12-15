// ============================================
// View Tracker - Client component to record views
// Fires once on mount, renders nothing
// ============================================

'use client';

import { useEffect } from 'react';

interface ViewTrackerProps {
  token: string;
}

export function ViewTracker({ token }: ViewTrackerProps) {
  useEffect(() => {
    // Fire and forget - don't block rendering
    fetch(`/api/shared/${token}/view`, { method: 'POST' }).catch(() => {
      // Silently ignore errors - view tracking is non-critical
    });
  }, [token]);

  return null;
}
