import React from 'react';
import { useStore } from '../store/useStore';

export const PropertyBar: React.FC = () => {
  const { tool, brushSettings, setBrushSettings } = useStore();

  if (tool !== 'brush' && tool !== 'eraser') return <div className="h-12 bg-gray-800 border-b border-gray-700"></div>;

  return (
    <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center px-6 space-x-8 text-sm text-gray-300 shadow-sm z-10">
      <div className="flex items-center space-x-3">
        <label className="font-medium">Size</label>
        <input
          type="range"
          min="1"
          max="100"
          value={brushSettings.size}
          onChange={(e) => setBrushSettings({ size: Number(e.target.value) })}
          className="w-32 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
        <span className="w-8 text-right">{brushSettings.size}px</span>
      </div>

      <div className="flex items-center space-x-3">
        <label className="font-medium">Opacity</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={brushSettings.opacity}
          onChange={(e) => setBrushSettings({ opacity: Number(e.target.value) })}
          className="w-32 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
        <span className="w-10 text-right">{Math.round(brushSettings.opacity * 100)}%</span>
      </div>

      {tool === 'brush' && (
         <div className="flex items-center space-x-3">
           <label className="font-medium">Color</label>
           <div className="relative overflow-hidden w-8 h-8 rounded-full border border-gray-600 shadow-inner">
             <input
               type="color"
               value={brushSettings.color}
               onChange={(e) => setBrushSettings({ color: e.target.value })}
               className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer p-0 border-0"
             />
           </div>
         </div>
      )}
    </div>
  );
};
