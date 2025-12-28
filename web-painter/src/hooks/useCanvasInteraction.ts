import { useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { drawStroke } from '../utils/draw';
import { floodFill } from '../utils/fill';
import { drawRect, drawCircle } from '../utils/shapes';

export const useCanvasInteraction = () => {
  const { tool, brushSettings, activeLayerId, zoom, setBrushSettings, pushHistory, layers } = useStore();
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Capture current state of all layers
  const saveState = () => {
     const historyState: ImageData[] = [];
     layers.forEach(l => {
        const canvas = document.getElementById(`canvas-${l.id}`) as HTMLCanvasElement;
        if (canvas) {
           const ctx = canvas.getContext('2d');
           if (ctx) {
              historyState.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
           }
        }
     });
     pushHistory(historyState);
  };

  const getCanvasCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: (clientX - rect.left) / zoom,
      y: (clientY - rect.top) / zoom,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!activeLayerId) return;
    const canvas = document.getElementById(`canvas-${activeLayerId}`) as HTMLCanvasElement;
    if (!canvas) return;

    if (!isDrawing) {
        // Save state before starting a new stroke (simplification: usually we save after, but for undoing the *previous* state we need a snapshot before or a stack of diffs)
        // Actually, typical Undo systems save the state *before* the action or push the *new* state after.
        // Let's push the *current* state (before modification) so we can go back to it.
        // But wait, if we are at index 0, we need the blank state too.
        // It's better to push the *new* state after modification, but we need an initial state.
        // For now, let's implement "Save After".
        // But wait, "undo" means "go to previous state".
        // If I draw, I create state 1. Current is 1. Undo -> 0.
        // So I need state 0 saved somewhere.
        // Ideally, we initialize history with the blank canvas.
    }

    setIsDrawing(true);
    const { x, y } = getCanvasCoordinates(e, canvas);
    lastPos.current = { x, y };
    startPos.current = { x, y };

    // Draw a single dot if it's a click
    const ctx = canvas.getContext('2d');
    if (ctx) {
       if (tool === 'brush' || tool === 'eraser') {
         drawStroke(ctx, x, y, x, y, brushSettings, tool === 'eraser');
       } else if (tool === 'fill') {
         floodFill(ctx, x, y, brushSettings.color, canvas.width, canvas.height);
       } else if (tool === 'picker') {
         const pixel = ctx.getImageData(x, y, 1, 1).data;
         const color = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
         setBrushSettings({ color });
         setIsDrawing(false);
       } else if (tool === 'rect' || tool === 'circle') {
         tempCanvasRef.current = document.createElement('canvas');
         tempCanvasRef.current.width = canvas.width;
         tempCanvasRef.current.height = canvas.height;
         const tempCtx = tempCanvasRef.current.getContext('2d');
         tempCtx?.drawImage(canvas, 0, 0);
       }
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !activeLayerId) return;
    const canvas = document.getElementById(`canvas-${activeLayerId}`) as HTMLCanvasElement;
    if (!canvas) return;

    const { x, y } = getCanvasCoordinates(e, canvas);
    const ctx = canvas.getContext('2d');

    if (ctx && lastPos.current) {
      if (tool === 'brush' || tool === 'eraser') {
        drawStroke(ctx, x, y, lastPos.current.x, lastPos.current.y, brushSettings, tool === 'eraser');
      } else if ((tool === 'rect' || tool === 'circle') && startPos.current && tempCanvasRef.current) {
        // Restore original state
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(tempCanvasRef.current, 0, 0);

        // Draw shape preview
        if (tool === 'rect') {
          drawRect(ctx, startPos.current.x, startPos.current.y, x, y, brushSettings);
        } else {
          drawCircle(ctx, startPos.current.x, startPos.current.y, x, y, brushSettings);
        }
      }
    }

    lastPos.current = { x, y };
  };

  const stopDrawing = () => {
    if (isDrawing) {
       saveState();
    }
    setIsDrawing(false);
    lastPos.current = null;
    startPos.current = null;
    tempCanvasRef.current = null;
  };

  return {
    startDrawing,
    draw,
    stopDrawing
  };
};
