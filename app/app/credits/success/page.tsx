'use client';

// ============================================
// RIFF - Credit Purchase Result Page
// Handles both success and failure states
// ============================================

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, Coins, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { RiffIcon } from '@/components/RiffIcon';

// Inner component that uses useSearchParams
function CreditsPurchaseResultContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const paymentId = searchParams.get('payment_id');

  const isSuccess = status !== 'failed' && status !== 'cancelled';
  const isCancelled = status === 'cancelled';

  const [balance, setBalance] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(isSuccess);

  useEffect(() => {
    // Fetch updated balance
    const fetchBalance = async () => {
      try {
        const res = await fetch('/api/credits');
        if (res.ok) {
          const data = await res.json();
          setBalance(data.balance);
        }
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      }
    };

    fetchBalance();

    // Hide confetti after animation
    if (isSuccess) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="text-center max-w-md"
    >
      {isSuccess ? (
        /* Success State */
        <>
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="
              relative w-24 h-24 mx-auto mb-8
              rounded-3xl bg-gradient-to-br from-emerald-500/20 to-green-600/20
              border border-emerald-500/30
              flex items-center justify-center
            "
          >
            <Check className="w-12 h-12 text-emerald-400" strokeWidth={3} />

            {/* Celebration particles */}
            {showConfetti && (
              <>
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: ['#fbbf24', '#f97316', '#22c55e', '#3b82f6', '#a855f7'][i % 5],
                    }}
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{
                      x: Math.cos((i * 30 * Math.PI) / 180) * 80,
                      y: Math.sin((i * 30 * Math.PI) / 180) * 80,
                      opacity: 0,
                      scale: 0,
                    }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
                  />
                ))}
              </>
            )}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-3xl font-bold mb-3"
          >
            Credits added!
          </motion.h1>

          {/* Balance display */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            {balance !== null ? (
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center">
                  <Coins className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-semibold text-white tabular-nums">
                    {Math.round(balance)}
                  </div>
                  <div className="text-xs text-white/40">credits available</div>
                </div>
              </div>
            ) : (
              <div className="text-white/50">Loading balance...</div>
            )}
          </motion.div>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/50 mb-8 leading-relaxed"
          >
            Your credits are ready to use. Generate images, create themes,
            and convert documents to beautiful presentations.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              href="/editor"
              className="
                inline-flex items-center gap-2.5 px-6 py-3.5
                bg-white text-black
                hover:bg-white/90
                rounded-xl font-semibold text-sm
                transition-all
              "
            >
              🎨 Start creating
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Thank you note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-xs text-white/25"
          >
            Thank you for supporting Riff.
          </motion.p>
        </>
      ) : (
        /* Failure/Cancelled State */
        <>
          {/* Failure icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="
              relative w-24 h-24 mx-auto mb-8
              rounded-3xl bg-gradient-to-br from-red-500/20 to-rose-600/20
              border border-red-500/30
              flex items-center justify-center
            "
          >
            <X className="w-12 h-12 text-red-400" strokeWidth={3} />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-3xl font-bold mb-3"
          >
            {isCancelled ? 'Payment cancelled' : 'Payment failed'}
          </motion.h1>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/50 mb-8 leading-relaxed"
          >
            {isCancelled
              ? "No worries! You can try again whenever you're ready."
              : "Something went wrong with your payment. Don't worry, you weren't charged."}
          </motion.p>

          {/* Current balance */}
          {balance !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center">
                  <Coins className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-semibold text-white tabular-nums">
                    {Math.round(balance)}
                  </div>
                  <div className="text-xs text-white/40">current balance</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              href="/editor"
              className="
                inline-flex items-center justify-center gap-2 px-6 py-3
                bg-white/[0.05] border border-white/[0.1]
                hover:bg-white/[0.08]
                rounded-xl font-medium text-sm text-white/70
                transition-all
              "
            >
              Back to editor
            </Link>
            <button
              onClick={() => window.history.back()}
              className="
                inline-flex items-center justify-center gap-2 px-6 py-3
                bg-white text-black
                hover:bg-white/90
                rounded-xl font-semibold text-sm
                transition-all
              "
            >
              <RefreshCw className="w-4 h-4" />
              Try again
            </button>
          </motion.div>

          {/* Payment ID for reference */}
          {paymentId && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 text-xs text-white/20"
            >
              Reference: {paymentId}
            </motion.p>
          )}
        </>
      )}
    </motion.div>
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
      </div>
      <p className="text-white/40">Loading...</p>
    </div>
  );
}

// Main export with Suspense boundary
export default function CreditsPurchaseResult() {
  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col">
      {/* Simple header */}
      <nav className="px-6 h-16 flex items-center border-b border-white/[0.05]">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <RiffIcon size={26} primaryColor="rgba(255, 255, 255, 0.9)" secondaryColor="rgba(255, 255, 255, 0.5)" />
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-xl font-semibold tracking-tight">
            Riff
          </span>
        </Link>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Suspense fallback={<LoadingFallback />}>
          <CreditsPurchaseResultContent />
        </Suspense>
      </div>
    </div>
  );
}
