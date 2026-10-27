import React from 'react';
import { Target, Clock, CheckCircle2, Circle } from 'lucide-react';
import { StudyObjective } from '../types/studyObjective';

interface StatsBannerProps {
  objectives: StudyObjective[];
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ objectives }) => {
  const total = objectives.length;
  const naoIniciados = objectives.filter((o) => o.status === 'nao_iniciado').length;
  const emAndamento = objectives.filter((o) => o.status === 'em_andamento').length;
  const concluidos = objectives.filter((o) => o.status === 'concluido').length;
  
  const percentualConclusao = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-pink-600 block mb-1">
            Seu Painel de Progresso
          </span>
          <h2 className="text-lg font-bold text-slate-900">
            Você tem <span className="text-pink-600 tabular-nums">{total}</span> {total === 1 ? 'objetivo cadastrado' : 'objetivos cadastrados'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mantenha o foco em um objetivo por vez para construir consistência.
          </p>
        </div>

        {/* Barra de Conclusão */}
        <div className="w-full md:w-64 bg-slate-50 border border-slate-200/80 rounded-xl p-3">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-1.5">
            <span>Progresso Geral</span>
            <span className="text-pink-700 font-bold tabular-nums">{percentualConclusao}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentualConclusao}%` }}
              role="progressbar"
              aria-valuenow={percentualConclusao}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
        <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <Target className="w-3.5 h-3.5 text-pink-500" />
            <span>Total</span>
          </div>
          <span className="text-xl font-bold text-slate-900 tabular-nums">{total}</span>
        </div>

        <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <Circle className="w-3.5 h-3.5 text-slate-400" />
            <span>Não Iniciados</span>
          </div>
          <span className="text-xl font-bold text-slate-700 tabular-nums">{naoIniciados}</span>
        </div>

        <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3">
          <div className="flex items-center gap-2 text-amber-700 text-xs font-medium mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Em Andamento</span>
          </div>
          <span className="text-xl font-bold text-amber-900 tabular-nums">{emAndamento}</span>
        </div>

        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-medium mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Concluídos</span>
          </div>
          <span className="text-xl font-bold text-emerald-900 tabular-nums">{concluidos}</span>
        </div>
      </div>
    </div>
  );
};
