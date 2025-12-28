import { create } from 'zustand';
import type { Layer, ToolType, BrushSettings, CanvasSize } from '../types';

interface AppState {
  layers: Layer[];
  activeLayerId: string | null;
  canvasSize: CanvasSize;
  tool: ToolType;
  brushSettings: BrushSettings;
  zoom: number;
  history: ImageData[][]; // For now, storing ImageData is heavy but simple.
  historyIndex: number;

  // Actions
  setLayers: (layers: Layer[]) => void;
  addLayer: (layer: Layer) => void;
  removeLayer: (layerId: string) => void;
  updateLayer: (layerId: string, updates: Partial<Layer>) => void;
  setActiveLayerId: (id: string | null) => void;
  setTool: (tool: ToolType) => void;
  setBrushSettings: (settings: Partial<BrushSettings>) => void;
  setCanvasSize: (size: CanvasSize) => void;
  setZoom: (zoom: number) => void;

  // History Actions
  pushHistory: (state: ImageData[]) => void; // We might need a better history strategy
  undo: () => void;
  redo: () => void;
}

export const useStore = create<AppState>((set) => ({
  layers: [
    {
      id: 'layer-1',
      name: 'Layer 1',
      visible: true,
      opacity: 1,
      blendMode: 'normal',
    },
  ],
  activeLayerId: 'layer-1',
  canvasSize: { width: 800, height: 600 },
  tool: 'brush',
  brushSettings: {
    color: '#000000',
    size: 5,
    opacity: 1,
    hardness: 1,
    flow: 1,
  },
  zoom: 1,
  history: [],
  historyIndex: -1,

  setLayers: (layers) => set({ layers }),
  addLayer: (layer) =>
    set((state) => ({ layers: [...state.layers, layer], activeLayerId: layer.id })),
  removeLayer: (layerId) =>
    set((state) => ({
      layers: state.layers.filter((l) => l.id !== layerId),
      activeLayerId:
        state.activeLayerId === layerId
          ? state.layers[0]?.id || null
          : state.activeLayerId,
    })),
  updateLayer: (layerId, updates) =>
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === layerId ? { ...l, ...updates } : l
      ),
    })),
  setActiveLayerId: (id) => set({ activeLayerId: id }),
  setTool: (tool) => set({ tool }),
  setBrushSettings: (settings) =>
    set((state) => ({
      brushSettings: { ...state.brushSettings, ...settings },
    })),
  setCanvasSize: (size) => set({ canvasSize: size }),
  setZoom: (zoom) => set({ zoom }),

  // History placeholder (will be implemented in detail later)
  pushHistory: (state) => set((prevState) => {
    // Only keep last 20 steps to save memory
    const newHistory = prevState.history.slice(0, prevState.historyIndex + 1);
    newHistory.push(state);
    if (newHistory.length > 20) newHistory.shift();
    return {
      history: newHistory,
      historyIndex: newHistory.length - 1
    };
  }),
  undo: () => set((state) => {
    if (state.historyIndex > 0) {
      return { historyIndex: state.historyIndex - 1 };
    }
    return state;
  }),
  redo: () => set((state) => {
    if (state.historyIndex < state.history.length - 1) {
      return { historyIndex: state.historyIndex + 1 };
    }
    return state;
  }),
}));
