import React from 'react';
import { Compass, PlusCircle, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  onNewClick: () => void;
  onLoadSamples: () => void;
  isFiltered?: boolean;
  onClearFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onNewClick,
  onLoadSamples,
  isFiltered,
  onClearFilters,
}) => {
  if (isFiltered) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center max-w-md mx-auto my-8">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 mx-auto mb-4">
          <Compass className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Nenhum objetivo encontrado
        </h3>
        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          Não encontramos nenhum objetivo com os filtros ou termo de busca selecionados.
        </p>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Limpar Filtros
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto my-8 shadow-xs">
      <div className="w-14 h-14 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 mx-auto mb-4">
        <Compass className="w-7 h-7" />
      </div>
      
      <h3 className="text-lg font-bold text-slate-900 mb-1.5">
        Seu fluxo de estudos começa aqui!
      </h3>
      
      <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
        Você ainda não cadastrou nenhum objetivo. O segredo de quem aprende de verdade é dividir o conteúdo em metas pequenas e fáceis de acompanhar.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onNewClick}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 rounded-xl shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Cadastrar Primeiro Objetivo</span>
        </button>

        <button
          type="button"
          onClick={onLoadSamples}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-100 rounded-xl transition-colors"
        >
          <Sparkles className="w-4 h-4 text-pink-500" />
          <span>Carregar Exemplos Práticos</span>
        </button>
      </div>
    </div>
  );
};
