'use client';

// ============================================
// RIFF - Legal Page Layout
// Clean, readable layout for Terms & Privacy
// ============================================

import Link from 'next/link';
import { RiffIcon } from './RiffIcon';

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-[#030303] text-[#fafafa]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030303]/80 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <RiffIcon size={26} primaryColor="rgba(255, 255, 255, 0.9)" secondaryColor="rgba(255, 255, 255, 0.5)" />
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-xl font-semibold tracking-tight">
              Riff
            </span>
          </Link>
          <Link
            href="/editor"
            className="text-[13px] text-white/50 hover:text-white transition-colors"
          >
            Back to Editor
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <header className="mb-12">
            <h1 className="text-4xl font-semibold tracking-tight mb-3">{title}</h1>
            <p className="text-white/40 text-sm">Last updated: {lastUpdated}</p>
          </header>

          {/* Body */}
          <article className="prose prose-invert prose-lg max-w-none">
            {children}
          </article>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/[0.05]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-white/30">
          <div className="flex items-center gap-2.5">
            <RiffIcon size={20} primaryColor="rgba(255, 255, 255, 0.5)" secondaryColor="rgba(255, 255, 255, 0.25)" />
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="font-medium">Riff</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-white/50 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white/50 transition-colors">Privacy</Link>
            <Link href="/" className="hover:text-white/50 transition-colors">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Styled components for legal content
export function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10">
      <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
      <div className="text-white/70 space-y-4 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-base font-medium text-white/90 mb-2">{title}</h3>
      <div className="text-white/60 space-y-3">
        {children}
      </div>
    </div>
  );
}

export function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-outside ml-5 space-y-2 text-white/60">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
