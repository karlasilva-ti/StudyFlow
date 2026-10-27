import React from 'react';
import { Search, X } from 'lucide-react';
import { StatusFilter, StudyObjective, STATUS_CONFIG } from '../types/studyObjective';

interface FilterBarProps {
  currentFilter: StatusFilter;
  onFilterChange: (filter: StatusFilter) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  objectives: StudyObjective[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentFilter,
  onFilterChange,
  searchTerm,
  onSearchChange,
  objectives,
}) => {
  const counts = {
    todos: objectives.length,
    nao_iniciado: objectives.filter((o) => o.status === 'nao_iniciado').length,
    em_andamento: objectives.filter((o) => o.status === 'em_andamento').length,
    concluido: objectives.filter((o) => o.status === 'concluido').length,
  };

  const filterTabs: { key: StatusFilter; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'nao_iniciado', label: STATUS_CONFIG.nao_iniciado.label },
    { key: 'em_andamento', label: STATUS_CONFIG.em_andamento.label },
    { key: 'concluido', label: STATUS_CONFIG.concluido.label },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      {/* Abas de Status com contador */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl overflow-x-auto">
        {filterTabs.map((tab) => {
          const isActive = currentFilter === tab.key;
          const count = counts[tab.key];

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onFilterChange(tab.key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${
                  isActive ? 'bg-pink-50 text-pink-700' : 'bg-slate-300/60 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Busca rápida */}
      <div className="relative w-full sm:w-64">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar objetivo..."
          className="w-full pl-8 pr-8 py-1.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            aria-label="Limpar busca"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
