import React from 'react';
import { useStore } from '../store/useStore';
import { CanvasLayer } from './CanvasLayer';
import { useCanvasInteraction } from '../hooks/useCanvasInteraction';

export const Workspace: React.FC = () => {
  const { canvasSize, zoom, layers, activeLayerId, history, historyIndex } = useStore();
  const { startDrawing, draw, stopDrawing } = useCanvasInteraction();

  // Restore history when index changes
  React.useEffect(() => {
    if (historyIndex >= 0 && history[historyIndex]) {
       const state = history[historyIndex];
       // Assuming state order matches layers order for now
       layers.forEach((layer, index) => {
          if (state[index]) {
             const canvas = document.getElementById(`canvas-${layer.id}`) as HTMLCanvasElement;
             const ctx = canvas?.getContext('2d');
             if (ctx) {
                ctx.putImageData(state[index], 0, 0);
             }
          }
       });
    }
  }, [historyIndex, layers, history]);

  return (
    <div className="flex-1 bg-gray-900 overflow-auto flex items-center justify-center p-8 relative">
      <div
        className="bg-white shadow-lg relative touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          backgroundImage:
            'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        }}
      >
        {layers.map((layer) => (
          <CanvasLayer
            key={layer.id}
            layer={layer}
            width={canvasSize.width}
            height={canvasSize.height}
            isActive={layer.id === activeLayerId}
          />
        ))}
      </div>
    </div>
  );
};
