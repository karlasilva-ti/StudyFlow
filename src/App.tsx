/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { StatsBanner } from './components/StatsBanner';
import { ObjectiveForm } from './components/ObjectiveForm';
import { ObjectiveCard } from './components/ObjectiveCard';
import { FilterBar } from './components/FilterBar';
import { EmptyState } from './components/EmptyState';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { storageService } from './services/storageService';
import {
  ObjectiveFormData,
  StatusFilter,
  StudyObjective,
  StudyStatus,
} from './types/studyObjective';
import { Check, Sparkles, HelpCircle } from 'lucide-react';

export default function App() {
  const [objectives, setObjectives] = useState<StudyObjective[]>([]);
  const [editingObjective, setEditingObjective] = useState<StudyObjective | null>(null);
  const [deletingObjective, setDeletingObjective] = useState<StudyObjective | null>(null);
  const [currentFilter, setCurrentFilter] = useState<StatusFilter>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Carrega dados do localStorage ao montar o componente
  useEffect(() => {
    const saved = storageService.getObjectives();
    setObjectives(saved);
  }, []);

  // Exibe toast temporário
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3200);
  };

  // Cadastra novo ou salva edição
  const handleSubmitForm = (formData: ObjectiveFormData) => {
    if (editingObjective) {
      storageService.updateObjective(editingObjective.id, formData);
      setEditingObjective(null);
      showToast('Objetivo atualizado com sucesso!');
    } else {
      storageService.addObjective(formData);
      showToast('Novo objetivo de estudo cadastrado com sucesso!');
    }
    setObjectives(storageService.getObjectives());
  };

  // Inicia edição
  const handleStartEdit = (objective: StudyObjective) => {
    setEditingObjective(objective);
    // Rolagem suave até o formulário
    const formElement = document.getElementById('formulario-objetivo');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Cancela edição
  const handleCancelEdit = () => {
    setEditingObjective(null);
  };

  // Abre modal de confirmação para exclusão
  const handleDeleteRequest = (objective: StudyObjective) => {
    setDeletingObjective(objective);
  };

  // Confirmação efetiva da exclusão
  const handleConfirmDelete = () => {
    if (!deletingObjective) return;
    
    storageService.deleteObjective(deletingObjective.id);
    setObjectives(storageService.getObjectives());
    
    // Se o que estava sendo editado for excluído, cancela edição
    if (editingObjective?.id === deletingObjective.id) {
      setEditingObjective(null);
    }

    showToast(`O objetivo "${deletingObjective.title}" foi excluído.`);
    setDeletingObjective(null);
  };

  // Transição rápida de status
  const handleStatusChange = (id: string, newStatus: StudyStatus) => {
    storageService.updateObjective(id, { status: newStatus });
    setObjectives(storageService.getObjectives());
  };

  // Carregar exemplos de objetivos para estudante iniciante
  const handleLoadSamples = () => {
    const updated = storageService.loadSampleData();
    setObjectives(updated);
    showToast('Exemplos de objetivos carregados com sucesso!');
  };

  // Rola até o formulário para criar novo
  const handleNewObjectiveClick = () => {
    setEditingObjective(null);
    const formElement = document.getElementById('formulario-objetivo');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Foca no campo de título
      const titleInput = document.getElementById('title') as HTMLInputElement | null;
      if (titleInput) {
        setTimeout(() => titleInput.focus(), 300);
      }
    }
  };

  // Filtragem e busca
  const filteredObjectives = useMemo(() => {
    return objectives.filter((item) => {
      // Filtro de status
      if (currentFilter !== 'todos' && item.status !== currentFilter) {
        return false;
      }
      // Filtro de busca textual
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDescription = item.description.toLowerCase().includes(query);
        return matchesTitle || matchesDescription;
      }
      return true;
    });
  }, [objectives, currentFilter, searchTerm]);

  const isFiltered = currentFilter !== 'todos' || searchTerm.trim().length > 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Cabeçalho */}
      <Header
        totalCount={objectives.length}
        onNewObjectiveClick={handleNewObjectiveClick}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Painel com Métricas de Progresso e Quantidade Cadastrada */}
        <StatsBanner objectives={objectives} />

        {/* Layout em 2 colunas para desktop: Formulário à esquerda e Lista à direita */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Coluna do Formulário (5 cols em lg) */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
            <ObjectiveForm
              initialData={editingObjective}
              onSubmit={handleSubmitForm}
              onCancel={editingObjective ? handleCancelEdit : undefined}
            />

            {/* Dica acolhedora para o estudante iniciante */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 text-xs text-slate-600 shadow-xs flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 mt-0.5">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-800">
                  Como planejar um bom objetivo?
                </p>
                <p className="text-slate-500 leading-relaxed">
                  Divida assuntos grandes em sessões de 30 a 60 minutos. É melhor cumprir 3 pequenos objetivos do que travar em uma meta genérica!
                </p>
              </div>
            </div>
          </div>

          {/* Coluna da Listagem de Objetivos (7 cols em lg) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Barra de Filtros e Busca */}
            {objectives.length > 0 && (
              <FilterBar
                currentFilter={currentFilter}
                onFilterChange={setCurrentFilter}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                objectives={objectives}
              />
            )}

            {/* Lista de Objetivos ou Estados Vazios */}
            {objectives.length === 0 ? (
              <EmptyState
                onNewClick={handleNewObjectiveClick}
                onLoadSamples={handleLoadSamples}
              />
            ) : filteredObjectives.length === 0 ? (
              <EmptyState
                onNewClick={handleNewObjectiveClick}
                onLoadSamples={handleLoadSamples}
                isFiltered={isFiltered}
                onClearFilters={() => {
                  setCurrentFilter('todos');
                  setSearchTerm('');
                }}
              />
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredObjectives.map((obj) => (
                  <ObjectiveCard
                    key={obj.id}
                    objective={obj}
                    onEdit={handleStartEdit}
                    onDeleteRequest={handleDeleteRequest}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de Confirmação de Exclusão */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingObjective)}
        objective={deletingObjective}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingObjective(null)}
      />

      {/* Notificação Toast Flutuante */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Rodapé Acolhedor */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">StudyFlow</span>
            <span>·</span>
            <span>Feito para apoiar estudantes em sua jornada de aprendizagem</span>
          </div>
          <div className="flex items-center gap-1.5 text-pink-600 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dados salvos automaticamente no seu navegador</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
