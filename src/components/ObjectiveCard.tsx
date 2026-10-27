import React from 'react';
import { Calendar, Edit3, Trash2, CheckCircle2, Clock, PlayCircle, ArrowRight } from 'lucide-react';
import { StudyObjective, StudyStatus, STATUS_CONFIG } from '../types/studyObjective';

interface ObjectiveCardProps {
  objective: StudyObjective;
  onEdit: (objective: StudyObjective) => void;
  onDeleteRequest: (objective: StudyObjective) => void;
  onStatusChange: (id: string, newStatus: StudyStatus) => void;
}

export const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
  objective,
  onEdit,
  onDeleteRequest,
  onStatusChange,
}) => {
  const statusConfig = STATUS_CONFIG[objective.status];

  // Formatação legível da data para pt-BR
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Sem prazo';
    try {
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Cálculo da proximidade do prazo
  const getDeadlineStatus = (dateString: string, currentStatus: StudyStatus) => {
    if (currentStatus === 'concluido') {
      return { label: 'Concluído', color: 'text-emerald-700 bg-emerald-50' };
    }

    if (!dateString) return null;

    const [year, month, day] = dateString.split('-').map(Number);
    const deadlineDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        label: `Atrasado há ${Math.abs(diffDays)} dia(s)`,
        color: 'text-rose-700 bg-rose-50 border border-rose-200',
      };
    }
    if (diffDays === 0) {
      return {
        label: 'Vence hoje!',
        color: 'text-amber-800 bg-amber-50 border border-amber-200',
      };
    }
    if (diffDays === 1) {
      return {
        label: 'Vence amanhã',
        color: 'text-amber-700 bg-amber-50 border border-amber-200',
      };
    }
    return {
      label: `Restam ${diffDays} dias`,
      color: 'text-slate-600 bg-slate-100 border border-slate-200',
    };
  };

  const deadlineBadge = getDeadlineStatus(objective.deadline, objective.status);

  // Próximo status no ciclo de estudo
  const getNextStatus = (current: StudyStatus): StudyStatus => {
    switch (current) {
      case 'nao_iniciado':
        return 'em_andamento';
      case 'em_andamento':
        return 'concluido';
      case 'concluido':
        return 'nao_iniciado';
    }
  };

  const nextStatus = getNextStatus(objective.status);
  const nextStatusLabel = STATUS_CONFIG[nextStatus].label;

  return (
    <article
      className={`bg-white border rounded-2xl p-5 shadow-xs transition-all duration-200 hover:shadow-md flex flex-col justify-between ${
        objective.status === 'concluido'
          ? 'border-emerald-200/80 bg-emerald-50/10'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div>
        {/* Topo do Card: Status & Proximidade */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusConfig.badgeClass}`}
            >
              {objective.status === 'nao_iniciado' && <Clock className="w-3 h-3" />}
              {objective.status === 'em_andamento' && <PlayCircle className="w-3 h-3 text-amber-600" />}
              {objective.status === 'concluido' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
              <span>{statusConfig.label}</span>
            </span>
          </div>

          {deadlineBadge && (
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${deadlineBadge.color}`}
            >
              {deadlineBadge.label}
            </span>
          )}
        </div>

        {/* Título do Objetivo */}
        <h3
          className={`text-base font-bold text-slate-900 leading-snug mb-2 ${
            objective.status === 'concluido' ? 'line-through text-slate-500' : ''
          }`}
        >
          {objective.title}
        </h3>

        {/* Descrição */}
        {objective.description ? (
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
            {objective.description}
          </p>
        ) : (
          <p className="text-xs text-slate-400 italic mb-4">
            Sem anotações complementares.
          </p>
        )}
      </div>

      {/* Rodapé do Card: Prazo e Ações */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Data formatada */}
        <div className="flex items-center gap-1.5 text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Prazo:</span>
          <span className="font-semibold text-slate-700">{formatDate(objective.deadline)}</span>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center justify-end gap-1.5 shrink-0">
          {/* Botão de Avanço Rápido de Status */}
          <button
            type="button"
            onClick={() => onStatusChange(objective.id, nextStatus)}
            title={`Mudar para: ${nextStatusLabel}`}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <span>Mudar status</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </button>

          {/* Botão Editar */}
          <button
            type="button"
            onClick={() => onEdit(objective)}
            title="Editar objetivo"
            className="p-1.5 text-slate-500 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
            aria-label={`Editar ${objective.title}`}
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {/* Botão Excluir */}
          <button
            type="button"
            onClick={() => onDeleteRequest(objective)}
            title="Excluir objetivo"
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            aria-label={`Excluir ${objective.title}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
