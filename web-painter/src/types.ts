export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity';

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number; // 0 to 1
  blendMode: BlendMode;
}

export type ToolType =
  | 'brush'
  | 'eraser'
  | 'fill'
  | 'picker'
  | 'move'
  | 'rect'
  | 'circle';

export interface BrushSettings {
  color: string; // Hex or RGB
  size: number;
  opacity: number; // 0 to 1
  hardness: number; // 0 to 1
  flow: number; // 0 to 1
}

export interface CanvasSize {
  width: number;
  height: number;
}
