/**
 * Tipos de dados para o gerenciamento de objetivos de estudo no StudyFlow.
 */

export type StudyStatus = 'nao_iniciado' | 'em_andamento' | 'concluido';

export interface StudyObjective {
  id: string;
  title: string;
  description: string;
  deadline: string; // Formato YYYY-MM-DD
  status: StudyStatus;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}

export type ObjectiveFormData = {
  title: string;
  description: string;
  deadline: string;
  status: StudyStatus;
};

export type StatusFilter = 'todos' | StudyStatus;

export const STATUS_CONFIG: Record<
  StudyStatus,
  {
    label: string;
    description: string;
    badgeClass: string;
    textClass: string;
    borderClass: string;
    bgSoftClass: string;
  }
> = {
  nao_iniciado: {
    label: 'Não iniciado',
    description: 'Planejado para começar em breve',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    textClass: 'text-slate-600',
    borderClass: 'border-slate-200',
    bgSoftClass: 'bg-slate-50',
  },
  em_andamento: {
    label: 'Em andamento',
    description: 'Você está estudando este tópico',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-200',
    bgSoftClass: 'bg-amber-50/50',
  },
  concluido: {
    label: 'Concluído',
    description: 'Objetivo de aprendizagem alcançado!',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200',
    bgSoftClass: 'bg-emerald-50/50',
  },
};
