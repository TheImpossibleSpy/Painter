import React, { useRef } from 'react';
import type { Layer } from '../types';

interface CanvasLayerProps {
  layer: Layer;
  width: number;
  height: number;
  isActive: boolean;
}

export const CanvasLayer: React.FC<CanvasLayerProps> = ({
  layer,
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Need access to store to get history
  // Actually, restoring history is complex because we need to know WHICH layer maps to which ImageData
  // For simplicity in this MVP, we assume layers order doesn't change OR we store layer ID in history.
  // The current history implementation stores ImageData[] which corresponds to layers index.
  // This is fragile if layers are reordered.
  // But let's stick to the plan: restore history on undo/redo.

  // We need to listen to history changes.
  // But CanvasLayer is inside a map.
  // Let's rely on a side effect in Workspace or a custom hook that restores canvas data.
  // Or, we can use a key prop to force re-render, but we need to put image data back.

  return (
    <canvas
      ref={canvasRef}
      id={`canvas-${layer.id}`}
      width={width}
      height={height}
      className="absolute top-0 left-0 pointer-events-none"
      style={{
        opacity: layer.opacity,
        display: layer.visible ? 'block' : 'none',
        mixBlendMode: layer.blendMode,
      }}
    />
  );
};
