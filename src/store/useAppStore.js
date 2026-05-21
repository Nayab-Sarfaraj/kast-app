import { create } from 'zustand';

export const useAppStore = create((set) => ({
  // Device Auth
  deviceId: null,
  jwtToken: null,
  
  // Generation Builder State
  currentPrompt: '',
  selectedModel: 'black-forest-labs/flux-schnell',
  selectedStyle: null,
  
  // Advanced Settings State
  settings: {
    aspectRatio: '1:1',
    cfgScale: 3.5,
    steps: 25,
    seed: null,
    negativePrompt: '',
  },
  
  // Actions
  setCredentials: (deviceId, jwtToken) => set({ deviceId, jwtToken }),
  
  setPrompt: (currentPrompt) => set({ currentPrompt }),
  
  setStyle: (selectedStyle) => set({ selectedStyle }),
  
  setModel: (selectedModel) => set({ selectedModel }),
  
  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  })),
  
  resetGenerationState: () => set({
    currentPrompt: '',
    selectedStyle: null,
    settings: {
      aspectRatio: '1:1',
      cfgScale: 3.5,
      steps: 25,
      seed: null,
      negativePrompt: '',
    }
  }),
}));
