import React from 'react';
import { BookOpen, Sparkles, PlusCircle } from 'lucide-react';

interface HeaderProps {
  totalCount: number;
  onNewObjectiveClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ totalCount, onNewObjectiveClick }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center text-white shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                StudyFlow
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-pink-700 bg-pink-50 border border-pink-100 rounded-md px-1.5 py-0.5">
                <Sparkles className="w-3 h-3 text-pink-500" />
                Iniciante
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Organize seus passos de estudo com clareza e ritmo
            </p>
          </div>
        </div>

        {/* Counter & Action */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 block font-medium">Cadastrados</span>
            <span className="text-sm font-bold text-slate-800 tabular-nums">
              {totalCount} {totalCount === 1 ? 'objetivo' : 'objetivos'}
            </span>
          </div>

          <button
            type="button"
            onClick={onNewObjectiveClick}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-white bg-pink-600 hover:bg-pink-700 active:bg-pink-800 rounded-lg shadow-xs transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Novo Objetivo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
