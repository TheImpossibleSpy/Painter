import React from 'react';
import { useStore } from '../store/useStore';
import {
  Brush,
  Eraser,
  PaintBucket,
  Pipette,
  Move,
  Square,
  Circle,
  Undo,
  Redo
} from 'lucide-react';
import clsx from 'clsx';
import type { ToolType } from '../types';

export const Toolbar: React.FC = () => {
  const { tool, setTool, undo, redo } = useStore();

  const tools: { id: ToolType; icon: React.ReactNode; label: string }[] = [
    { id: 'brush', icon: <Brush size={20} />, label: 'Brush' },
    { id: 'eraser', icon: <Eraser size={20} />, label: 'Eraser' },
    { id: 'fill', icon: <PaintBucket size={20} />, label: 'Fill' },
    { id: 'picker', icon: <Pipette size={20} />, label: 'Picker' },
    { id: 'move', icon: <Move size={20} />, label: 'Move' },
    { id: 'rect', icon: <Square size={20} />, label: 'Rectangle' },
    { id: 'circle', icon: <Circle size={20} />, label: 'Circle' },
  ];

  return (
    <div className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 space-y-2">
      {tools.map((t) => (
        <button
          key={t.id}
          onClick={() => setTool(t.id)}
          title={t.label}
          className={clsx(
            'p-2 rounded-md transition-colors',
            tool === t.id
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
          )}
        >
          {t.icon}
        </button>
      ))}
      <div className="h-4"></div>
      <button onClick={undo} className="text-gray-400 hover:text-white p-2" title="Undo"><Undo size={20}/></button>
      <button onClick={redo} className="text-gray-400 hover:text-white p-2" title="Redo"><Redo size={20}/></button>
    </div>
  );
};
