'use client';

// ============================================
// RIFF - Insufficient Credits Modal
// Friendly prompt when credits run out
// ============================================

import { motion, AnimatePresence } from 'framer-motion';
import { X, Coins, Sparkles, ArrowRight, Zap } from 'lucide-react';

interface InsufficientCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
  requiredCredits: number;
  currentBalance: number;
  actionName?: string;
}

export function InsufficientCreditsModal({
  isOpen,
  onClose,
  onPurchase,
  requiredCredits,
  currentBalance,
  actionName = 'this action',
}: InsufficientCreditsModalProps) {
  const needed = Math.max(0, requiredCredits - currentBalance);
  const suggestedPurchase = Math.max(10, Math.ceil(needed / 5) * 5); // Round up to nearest 5, min 10

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="
              relative w-full max-w-sm pointer-events-auto
              bg-[#0a0a0a] border border-white/10 rounded-2xl
              shadow-2xl shadow-black/50 overflow-hidden
            ">
              {/* Decorative elements */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Content */}
              <div className="relative px-6 py-8 text-center">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                  className="
                    w-16 h-16 mx-auto mb-5
                    rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20
                    border border-amber-500/20
                    flex items-center justify-center
                  "
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  >
                    <Coins className="w-7 h-7 text-amber-400" />
                  </motion.div>
                </motion.div>

                {/* Title */}
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-xl font-semibold text-white mb-2">
                  Need more credits
                </h3>

                {/* Description */}
                <p className="text-sm text-white/50 mb-6 leading-relaxed">
                  {actionName.charAt(0).toUpperCase() + actionName.slice(1)} requires{' '}
                  <span className="text-amber-400 font-medium">{requiredCredits} credit{requiredCredits !== 1 ? 's' : ''}</span>
                  {currentBalance > 0 && (
                    <>
                      , but you have{' '}
                      <span className="text-white/70 font-medium">{currentBalance.toFixed(1)}</span>
                    </>
                  )}
                  .
                </p>

                {/* Visual breakdown */}
                <div className="flex items-center justify-center gap-4 mb-6 py-4 border-y border-white/[0.06]">
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-white/30 tabular-nums">
                      {currentBalance.toFixed(1)}
                    </div>
                    <div className="text-[10px] text-white/30 uppercase tracking-wider">You have</div>
                  </div>

                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5">
                    <ArrowRight className="w-4 h-4 text-white/30" />
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-semibold text-amber-400 tabular-nums">
                      {requiredCredits}
                    </div>
                    <div className="text-[10px] text-white/30 uppercase tracking-wider">Needed</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      onClose();
                      onPurchase();
                    }}
                    className="
                      w-full flex items-center justify-center gap-2.5 px-5 py-3.5
                      bg-gradient-to-r from-amber-500 to-orange-500
                      hover:from-amber-400 hover:to-orange-400
                      rounded-xl text-black font-semibold text-sm
                      transition-all shadow-lg shadow-amber-500/20
                    "
                  >
                    <Sparkles className="w-4 h-4" />
                    Add credits
                  </button>

                  <button
                    onClick={onClose}
                    className="
                      w-full px-5 py-2.5
                      text-white/40 hover:text-white/60 text-sm
                      transition-colors
                    "
                  >
                    Maybe later
                  </button>
                </div>

                {/* Reassurance */}
                <p className="mt-6 text-[11px] text-white/30 leading-relaxed">
                  No subscriptions required. Just buy what you need.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
