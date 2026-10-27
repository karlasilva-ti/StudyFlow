import { ObjectiveFormData, StudyObjective } from '../types/studyObjective';

const STORAGE_KEY = 'studyflow_objectives_v1';

/**
 * Exemplos iniciais acolhedores para estudantes iniciantes testarem a aplicação.
 */
export const SAMPLE_OBJECTIVES: Omit<StudyObjective, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Aprender a lógica básica de programação',
    description: 'Compreender o funcionamento de variáveis, condicionais (se/senão) e laços de repetição.',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'em_andamento',
  },
  {
    title: 'Revisar conceitos fundamentais de Matemática',
    description: 'Praticar frações, porcentagens e regra de três simples com 10 exercícios práticos.',
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'nao_iniciado',
  },
  {
    title: 'Criar meu ambiente de estudos organizado',
    description: 'Organizar cadernos, pasta no computador e definir 45 minutos diários de estudo contínuo.',
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'concluido',
  },
];

/**
 * Serviço responsável por toda a persistência dos objetivos no localStorage do navegador.
 */
export const storageService = {
  /**
   * Obtém a lista de todos os objetivos salvos.
   */
  getObjectives(): StudyObjective[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return [];
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed;
    } catch (error) {
      console.error('Erro ao ler objetivos do localStorage:', error);
      return [];
    }
  },

  /**
   * Salva a lista completa no localStorage.
   */
  saveObjectives(objectives: StudyObjective[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(objectives));
    } catch (error) {
      console.error('Erro ao salvar objetivos no localStorage:', error);
    }
  },

  /**
   * Cria e adiciona um novo objetivo.
   */
  addObjective(data: ObjectiveFormData): StudyObjective {
    const objectives = this.getObjectives();
    const now = new Date().toISOString();
    
    // Gerador de ID único simples e confiável
    const newObjective: StudyObjective = {
      id: 'obj_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7),
      title: data.title.trim(),
      description: data.description.trim(),
      deadline: data.deadline,
      status: data.status,
      createdAt: now,
      updatedAt: now,
    };

    const updatedList = [newObjective, ...objectives];
    this.saveObjectives(updatedList);
    return newObjective;
  },

  /**
   * Atualiza um objetivo existente pelo ID.
   */
  updateObjective(id: string, data: Partial<ObjectiveFormData>): StudyObjective | null {
    const objectives = this.getObjectives();
    const index = objectives.findIndex((item) => item.id === id);

    if (index === -1) {
      return null;
    }

    const current = objectives[index];
    const updatedObjective: StudyObjective = {
      ...current,
      ...(data.title !== undefined && { title: data.title.trim() }),
      ...(data.description !== undefined && { description: data.description.trim() }),
      ...(data.deadline !== undefined && { deadline: data.deadline }),
      ...(data.status !== undefined && { status: data.status }),
      updatedAt: new Date().toISOString(),
    };

    objectives[index] = updatedObjective;
    this.saveObjectives(objectives);
    return updatedObjective;
  },

  /**
   * Remove um objetivo pelo ID.
   */
  deleteObjective(id: string): boolean {
    const objectives = this.getObjectives();
    const filtered = objectives.filter((item) => item.id !== id);
    
    if (filtered.length === objectives.length) {
      return false;
    }

    this.saveObjectives(filtered);
    return true;
  },

  /**
   * Carrega exemplos de objetivos para ajudar novos estudantes a explorarem a ferramenta.
   */
  loadSampleData(): StudyObjective[] {
    const current = this.getObjectives();
    const now = new Date().toISOString();
    
    const sampleItems: StudyObjective[] = SAMPLE_OBJECTIVES.map((item, idx) => ({
      ...item,
      id: 'sample_' + Date.now().toString(36) + '_' + idx,
      createdAt: now,
      updatedAt: now,
    }));

    const combined = [...current, ...sampleItems];
    this.saveObjectives(combined);
    return combined;
  },

  /**
   * Limpa todos os dados armazenados.
   */
  clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
    }
  },
};
