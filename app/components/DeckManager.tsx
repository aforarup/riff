'use client';

// ============================================
// VIBE SLIDES - Deck Manager Component
// Minimal, Vercel-inspired design
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  FileText,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { Deck } from '@/lib/types';

interface DeckManagerProps {
  decks: Deck[];
  currentDeckId: string | null;
  onSelect: (id: string) => void;
  onCreate: (name: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function DeckManager({
  decks,
  currentDeckId,
  onSelect,
  onCreate,
  onDelete,
  isLoading = false,
}: DeckManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const currentDeck = decks.find((d) => d.id === currentDeckId);

  const handleCreate = () => {
    if (newDeckName.trim()) {
      onCreate(newDeckName.trim());
      setNewDeckName('');
      setIsCreating(false);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (deleteConfirm === id) {
      onDelete(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div className="relative">
      {/* Dropdown trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2.5 px-3 py-2
          bg-transparent hover:bg-surface
          border border-border hover:border-border-hover
          rounded-md text-text-secondary hover:text-text-primary
          transition-all duration-fast
          min-w-[180px]
        "
      >
        <FileText className="w-4 h-4 text-text-tertiary" />
        <span className="flex-1 text-left text-sm truncate">
          {isLoading ? 'Loading...' : currentDeck?.name || 'Select Deck'}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-text-tertiary transition-transform duration-fast ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => {
                setIsOpen(false);
                setIsCreating(false);
              }}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.1 }}
              className="
                absolute top-full left-0 mt-1.5 z-50
                w-72 max-h-96 overflow-hidden
                bg-surface border border-border rounded-lg
                shadow-xl shadow-black/20
              "
            >
              {/* Create new deck */}
              <div className="p-2 border-b border-border">
                {isCreating ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={newDeckName}
                      onChange={(e) => setNewDeckName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                      placeholder="Deck name..."
                      className="
                        flex-1 px-2.5 py-1.5 bg-background rounded-md
                        text-text-primary text-sm placeholder:text-text-quaternary
                        border border-border focus:border-border-focus
                        outline-none
                      "
                      autoFocus
                    />
                    <button
                      onClick={handleCreate}
                      disabled={!newDeckName.trim()}
                      className="p-1.5 bg-text-primary text-background rounded-md hover:bg-text-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setIsCreating(false);
                        setNewDeckName('');
                      }}
                      className="p-1.5 bg-surface-hover rounded-md text-text-tertiary hover:text-text-primary transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsCreating(true)}
                    className="
                      w-full flex items-center gap-2 px-2.5 py-2
                      text-text-secondary hover:text-text-primary
                      hover:bg-surface-hover rounded-md
                      transition-colors text-sm
                    "
                  >
                    <Plus className="w-4 h-4" />
                    New Deck
                  </button>
                )}
              </div>

              {/* Deck list */}
              <div className="overflow-y-auto max-h-64 p-1.5">
                {decks.length === 0 ? (
                  <div className="px-3 py-6 text-center">
                    <FileText className="w-6 h-6 mx-auto mb-2 text-text-quaternary" />
                    <p className="text-sm text-text-tertiary">No decks yet</p>
                    <p className="text-xs mt-0.5 text-text-quaternary">
                      Create one to get started
                    </p>
                  </div>
                ) : (
                  decks.map((deck) => (
                    <motion.div
                      key={deck.id}
                      layout
                      className={`
                        group flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer
                        transition-colors
                        ${
                          deck.id === currentDeckId
                            ? 'bg-surface-hover text-text-primary'
                            : 'hover:bg-surface-hover text-text-secondary hover:text-text-primary'
                        }
                      `}
                      onClick={() => {
                        onSelect(deck.id);
                        setIsOpen(false);
                      }}
                    >
                      <FileText className="w-4 h-4 flex-shrink-0 text-text-tertiary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{deck.name}</p>
                        <p className="text-xs text-text-quaternary">
                          {new Date(deck.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDelete(deck.id, e)}
                        className={`
                          p-1 rounded transition-all opacity-0 group-hover:opacity-100
                          ${
                            deleteConfirm === deck.id
                              ? 'bg-error text-white opacity-100'
                              : 'hover:bg-error/10 text-text-quaternary hover:text-error'
                          }
                        `}
                        title={deleteConfirm === deck.id ? 'Click to confirm' : 'Delete'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
