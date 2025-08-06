/**
 * 🧠 ASTROFLORA GLOBAL STATE MANAGER
 * Cerebro central de la plataforma usando Zustand
 * Maneja estado de visualizaciones, experimentos y Driver AI
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Tipos de estado para diferentes módulos
export interface MolecularVisualizationState {
  currentPdbId: string | null;
  currentSequence: string | null;
  viewerMode: 'cartoon' | 'surface' | 'ball-stick' | 'spacefill';
  isLoading: boolean;
  error: string | null;
}

export interface ExperimentState {
  activeExperiment: string | null;
  protocolSteps: any[];
  currentStep: number;
  experimentResults: any[];
  runningExperiments: any[];
}

export interface DriverAIState {
  isOnline: boolean;
  currentConversation: string[];
  processingCommand: boolean;
  lastResponse: any;
  mode: 'jarvis' | 'analysis' | 'swarm';
}

export interface PCAPlotState {
  data: any[];
  selectedPoints: number[];
  colorBy: string;
  isLoading: boolean;
}

export interface AstrofloraGlobalState {
  // Módulos principales
  molecular: MolecularVisualizationState;
  experiments: ExperimentState;
  driverAI: DriverAIState;
  pcaPlot: PCAPlotState;
  
  // Actions para Molecular Visualization
  loadPDB: (pdbId: string) => void;
  setSequence: (sequence: string) => void;
  setViewerMode: (mode: MolecularVisualizationState['viewerMode']) => void;
  setMolecularLoading: (loading: boolean) => void;
  setMolecularError: (error: string | null) => void;
  
  // Actions para Driver AI
  setDriverAIOnline: (online: boolean) => void;
  addMessage: (message: any) => void;
  setProcessingCommand: (processing: boolean) => void;
  executeDriverCommand: (command: any) => void;
  
  // Actions para PCA Plot
  setPCAData: (data: any[]) => void;
  selectPCAPoints: (points: number[]) => void;
  setPCAColorBy: (colorBy: string) => void;
  
  // Actions para Experimentos
  setActiveExperiment: (experimentId: string) => void;
  createExperiment: (experiment: any) => void;
  addProtocolStep: (step: any) => void;
  nextStep: () => void;
  setCurrentStep: (step: number) => void;
  addExperimentResult: (result: any) => void;
  
  // Meta actions
  reset: () => void;
  getState: () => AstrofloraGlobalState;
}

// Estado inicial
const initialState = {
  molecular: {
    currentPdbId: null,
    currentSequence: null,
    viewerMode: 'cartoon' as const,
    isLoading: false,
    error: null
  },
  experiments: {
    activeExperiment: null,
    protocolSteps: [],
    currentStep: 0,
    experimentResults: [],
    runningExperiments: []
  },
  driverAI: {
    isOnline: false,
    currentConversation: [],
    processingCommand: false,
    lastResponse: null,
    mode: 'jarvis' as const
  },
  pcaPlot: {
    data: [],
    selectedPoints: [],
    colorBy: 'default',
    isLoading: false
  }
};

// Crear el store con Zustand
export const useAstrofloraStore = create<AstrofloraGlobalState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // 🧬 MOLECULAR VISUALIZATION ACTIONS
        loadPDB: (pdbId: string) => {
          console.log('🧬 Global State: Loading PDB', pdbId);
          set((state) => ({
            molecular: {
              ...state.molecular,
              currentPdbId: pdbId,
              isLoading: true,
              error: null
            }
          }));
        },

        setSequence: (sequence: string) => {
          console.log('🧬 Global State: Setting sequence', sequence.substring(0, 50) + '...');
          set((state) => ({
            molecular: {
              ...state.molecular,
              currentSequence: sequence
            }
          }));
        },

        setViewerMode: (mode) => {
          console.log('🧬 Global State: Setting viewer mode', mode);
          set((state) => ({
            molecular: {
              ...state.molecular,
              viewerMode: mode
            }
          }));
        },

        setMolecularLoading: (loading) => {
          set((state) => ({
            molecular: {
              ...state.molecular,
              isLoading: loading
            }
          }));
        },

        setMolecularError: (error) => {
          set((state) => ({
            molecular: {
              ...state.molecular,
              error,
              isLoading: false
            }
          }));
        },

        // 🤖 DRIVER AI ACTIONS
        setDriverAIOnline: (online) => {
          console.log('🤖 Global State: Driver AI status', online ? 'ONLINE' : 'OFFLINE');
          set((state) => ({
            driverAI: {
              ...state.driverAI,
              isOnline: online
            }
          }));
        },

        addMessage: (message) => {
          set((state) => ({
            driverAI: {
              ...state.driverAI,
              currentConversation: [...state.driverAI.currentConversation, message],
              lastResponse: message.role === 'assistant' ? message : state.driverAI.lastResponse
            }
          }));
        },

        setProcessingCommand: (processing) => {
          set((state) => ({
            driverAI: {
              ...state.driverAI,
              processingCommand: processing
            }
          }));
        },

        // 🎯 COMANDO CENTRAL: Ejecutar comandos del Driver AI
        executeDriverCommand: (command) => {
          console.log('🎯 Global State: Executing Driver AI command', command);
          
          const { type, payload } = command;
          
          switch (type) {
            case 'LOAD_PDB':
              get().loadPDB(payload);
              break;
              
            case 'SET_SEQUENCE':
              get().setSequence(payload);
              break;
              
            case 'SET_VIEWER_MODE':
              get().setViewerMode(payload);
              break;
              
            case 'LOAD_PCA_DATA':
              get().setPCAData(payload);
              break;
              
            case 'START_EXPERIMENT':
              get().setActiveExperiment(payload);
              break;
              
            case 'ADD_PROTOCOL_STEP':
              get().addProtocolStep(payload);
              break;
              
            default:
              console.warn('🚨 Unknown command type:', type);
          }
        },

        // 📊 PCA PLOT ACTIONS
        setPCAData: (data) => {
          console.log('📊 Global State: Setting PCA data', data.length, 'points');
          set((state) => ({
            pcaPlot: {
              ...state.pcaPlot,
              data,
              isLoading: false
            }
          }));
        },

        selectPCAPoints: (points) => {
          set((state) => ({
            pcaPlot: {
              ...state.pcaPlot,
              selectedPoints: points
            }
          }));
        },

        setPCAColorBy: (colorBy) => {
          set((state) => ({
            pcaPlot: {
              ...state.pcaPlot,
              colorBy
            }
          }));
        },

        // 🧪 EXPERIMENT ACTIONS
        setActiveExperiment: (experimentId) => {
          console.log('🧪 Global State: Setting active experiment', experimentId);
          set((state) => ({
            experiments: {
              ...state.experiments,
              activeExperiment: experimentId,
              currentStep: 0
            }
          }));
        },

        createExperiment: (experiment) => {
          console.log('🧪 Global State: Creating experiment', experiment);
          const experimentId = `exp_${Date.now()}`;
          set((state) => ({
            experiments: {
              ...state.experiments,
              activeExperiment: experimentId,
              protocolSteps: experiment.steps || [],
              currentStep: 0,
              experimentResults: []
            }
          }));
        },

        addProtocolStep: (step) => {
          set((state) => ({
            experiments: {
              ...state.experiments,
              protocolSteps: [...state.experiments.protocolSteps, step]
            }
          }));
        },

        nextStep: () => {
          set((state) => ({
            experiments: {
              ...state.experiments,
              currentStep: Math.min(
                state.experiments.currentStep + 1,
                state.experiments.protocolSteps.length - 1
              )
            }
          }));
        },

        setCurrentStep: (step) => {
          set((state) => ({
            experiments: {
              ...state.experiments,
              currentStep: step
            }
          }));
        },

        addExperimentResult: (result) => {
          set((state) => ({
            experiments: {
              ...state.experiments,
              experimentResults: [...state.experiments.experimentResults, result]
            }
          }));
        },

        // 🔄 META ACTIONS
        reset: () => {
          console.log('🔄 Global State: Resetting all state');
          set(initialState);
        },

        getState: () => get()
      }),
      {
        name: 'astroflora-state',
        partialize: (state) => ({
          // Persistir solo lo necesario
          molecular: {
            currentPdbId: state.molecular.currentPdbId,
            viewerMode: state.molecular.viewerMode
          },
          driverAI: {
            mode: state.driverAI.mode
          }
        })
      }
    ),
    {
      name: 'astroflora-store'
    }
  )
);

// 🎯 SELECTOR HOOKS ESPECIALIZADOS
export const useMolecularState = () => useAstrofloraStore((state) => state.molecular);
export const useDriverAIState = () => useAstrofloraStore((state) => state.driverAI);
export const useExperimentState = () => useAstrofloraStore((state) => state.experiments);
export const usePCAState = () => useAstrofloraStore((state) => state.pcaPlot);

// 🎯 ACTION HOOKS
export const useMolecularActions = () => useAstrofloraStore((state) => ({
  loadPDB: state.loadPDB,
  setSequence: state.setSequence,
  setViewerMode: state.setViewerMode,
  setLoading: state.setMolecularLoading,
  setError: state.setMolecularError
}));

export const useDriverAIActions = () => useAstrofloraStore((state) => ({
  setOnline: state.setDriverAIOnline,
  addMessage: state.addMessage,
  executeCommand: state.executeDriverCommand,
  setProcessing: state.setProcessingCommand
}));

export const useExperimentActions = () => useAstrofloraStore((state) => ({
  createExperiment: state.createExperiment,
  addProtocolStep: state.addProtocolStep,
  setCurrentStep: state.setCurrentStep,
  addResult: state.addExperimentResult
}));
