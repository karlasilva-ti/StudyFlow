import React, { useState, useEffect } from 'react';
import { PlusCircle, Save, X, Calendar, BookMarked, AlignLeft, CheckCircle2 } from 'lucide-react';
import { ObjectiveFormData, StudyObjective, StudyStatus, STATUS_CONFIG } from '../types/studyObjective';

interface ObjectiveFormProps {
  initialData?: StudyObjective | null;
  onSubmit: (data: ObjectiveFormData) => void;
  onCancel?: () => void;
}

export const ObjectiveForm: React.FC<ObjectiveFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const isEditing = Boolean(initialData);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<StudyStatus>('nao_iniciado');
  const [error, setError] = useState<string | null>(null);

  // Preenche dados ao entrar em modo de edição ou reseta ao mudar
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setDeadline(initialData.deadline);
      setStatus(initialData.status);
      setError(null);
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    // Data padrão: 7 dias a partir de hoje
    const defaultDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setDeadline(defaultDate);
    setStatus('nao_iniciado');
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Por favor, informe o título do seu objetivo de estudo.');
      return;
    }

    if (!deadline) {
      setError('Por favor, selecione uma data limite ou prazo para o objetivo.');
      return;
    }

    setError(null);
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      deadline,
      status,
    });

    if (!isEditing) {
      resetForm();
    }
  };

  // Atalhos práticos de data para facilitar a vida do estudante iniciante
  const setQuickDeadline = (daysAhead: number) => {
    const target = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
    setDeadline(target.toISOString().split('T')[0]);
  };

  return (
    <div
      id="formulario-objetivo"
      className={`bg-white border rounded-2xl p-5 sm:p-6 shadow-xs transition-all ${
        isEditing
          ? 'border-pink-300 ring-2 ring-pink-100 bg-pink-50/20'
          : 'border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isEditing
                ? 'bg-pink-100 text-pink-700'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {isEditing ? <Save className="w-4 h-4" /> : <BookMarked className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isEditing ? 'Editar Objetivo de Estudo' : 'Novo Objetivo de Estudo'}
            </h3>
            <p className="text-xs text-slate-500">
              {isEditing
                ? 'Atualize os dados e salve para manter sua rotina alinhada.'
                : 'Defina um objetivo claro para começar a aprender sem ansiedade.'}
            </p>
          </div>
        </div>

        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancelar</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mensagem de Erro de Validação */}
        {error && (
          <div
            role="alert"
            className="p-3 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 animate-in fade-in"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Campo Título */}
        <div>
          <label
            htmlFor="title"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Título do Objetivo <span className="text-rose-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Ex: Aprender o básico de algoritmos e variáveis"
            maxLength={120}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Dica: seja específico. Em vez de "Estudar Matemática", prefira "Resolver 10 exercícios de frações".
          </p>
        </div>

        {/* Campo Descrição */}
        <div>
          <label
            htmlFor="description"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5"
          >
            <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
            <span>Descrição ou Anotações</span>
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Ler o capítulo 2 do livro, assistir à aula de apoio e fazer anotações dos principais termos."
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-y"
          />
        </div>

        {/* Grid: Prazo e Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Prazo */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="deadline"
                className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Prazo Final <span className="text-rose-500">*</span></span>
              </label>
            </div>
            
            <input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => {
                setDeadline(e.target.value);
                if (error) setError(null);
              }}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
            />

            {/* Atalhos rápidos de data */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400">Atalhos:</span>
              <button
                type="button"
                onClick={() => setQuickDeadline(0)}
                className="text-[11px] text-slate-600 hover:text-pink-600 bg-slate-100 hover:bg-pink-50 px-2 py-0.5 rounded transition-colors"
              >
                Hoje
              </button>
              <button
                type="button"
                onClick={() => setQuickDeadline(3)}
                className="text-[11px] text-slate-600 hover:text-pink-600 bg-slate-100 hover:bg-pink-50 px-2 py-0.5 rounded transition-colors"
              >
                +3 dias
              </button>
              <button
                type="button"
                onClick={() => setQuickDeadline(7)}
                className="text-[11px] text-slate-600 hover:text-pink-600 bg-slate-100 hover:bg-pink-50 px-2 py-0.5 rounded transition-colors"
              >
                +1 semana
              </button>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Status do Objetivo
            </label>
            
            <div className="grid grid-cols-3 gap-2">
              {(['nao_iniciado', 'em_andamento', 'concluido'] as StudyStatus[]).map((st) => {
                const config = STATUS_CONFIG[st];
                const isSelected = status === st;

                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? `${config.borderClass} ${config.bgSoftClass} ring-2 ring-pink-500/20`
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span className={`text-xs font-bold ${isSelected ? config.textClass : 'text-slate-700'}`}>
                      {config.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {STATUS_CONFIG[status].description}
            </p>
          </div>
        </div>

        {/* Ações do Formulário */}
        <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
          {isEditing && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancelar Edição
            </button>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 active:bg-pink-800 rounded-xl shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
          >
            {isEditing ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Salvar Alterações</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Cadastrar Objetivo</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
