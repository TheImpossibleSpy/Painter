import type { BrushSettings } from '../types';

export function drawStroke(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  lastX: number,
  lastY: number,
  settings: BrushSettings,
  isEraser: boolean = false
) {
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = settings.size;

  if (isEraser) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = `rgba(0,0,0,${settings.opacity})`;
  } else {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = settings.color;
    ctx.globalAlpha = settings.opacity;
  }

  // Basic smoothing could be done here with quadratic curves if we tracked more points
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();

  // Reset
  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = 'source-over';
}
