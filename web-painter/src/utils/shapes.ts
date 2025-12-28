import type { BrushSettings } from '../types';

export function drawRect(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  settings: BrushSettings,
  isFilled: boolean = false
) {
  ctx.strokeStyle = settings.color;
  ctx.fillStyle = settings.color;
  ctx.lineWidth = settings.size;
  ctx.globalAlpha = settings.opacity;

  const width = endX - startX;
  const height = endY - startY;

  ctx.beginPath();
  if (isFilled) {
    ctx.fillRect(startX, startY, width, height);
  } else {
    ctx.rect(startX, startY, width, height);
    ctx.stroke();
  }

  ctx.globalAlpha = 1.0;
}

export function drawCircle(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  settings: BrushSettings,
  isFilled: boolean = false
) {
  ctx.strokeStyle = settings.color;
  ctx.fillStyle = settings.color;
  ctx.lineWidth = settings.size;
  ctx.globalAlpha = settings.opacity;

  const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

  ctx.beginPath();
  ctx.arc(startX, startY, radius, 0, 2 * Math.PI);

  if (isFilled) {
    ctx.fill();
  } else {
    ctx.stroke();
  }

  ctx.globalAlpha = 1.0;
}
