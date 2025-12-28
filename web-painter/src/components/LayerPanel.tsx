import React from 'react';
import { useStore } from '../store/useStore';
import { Eye, EyeOff, Trash2, Plus, Copy } from 'lucide-react';
import clsx from 'clsx';
import type { Layer } from '../types';

export const LayerPanel: React.FC = () => {
  const { layers, activeLayerId, setActiveLayerId, addLayer, removeLayer, updateLayer } = useStore();

  const handleAddLayer = () => {
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: `Layer ${layers.length + 1}`,
      visible: true,
      opacity: 1,
      blendMode: 'normal',
    };
    addLayer(newLayer);
  };

  const handleRemoveLayer = () => {
    if (activeLayerId && layers.length > 1) {
      removeLayer(activeLayerId);
    }
  };

  return (
    <div className="w-64 bg-gray-800 border-l border-gray-700 flex flex-col text-gray-300">
      <div className="p-2 border-b border-gray-700 font-semibold">Layers</div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {layers.map((layer) => (
          <div
            key={layer.id}
            onClick={() => setActiveLayerId(layer.id)}
            className={clsx(
              'flex items-center p-2 rounded cursor-pointer group mb-1',
              activeLayerId === layer.id ? 'bg-blue-600' : 'bg-gray-750 hover:bg-gray-700'
            )}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateLayer(layer.id, { visible: !layer.visible });
              }}
              className="mr-3 text-gray-400 hover:text-white focus:outline-none"
            >
              {layer.visible ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            <span className="flex-1 truncate select-none text-sm font-medium">{layer.name}</span>
            <span className="text-xs text-gray-300 ml-2 bg-black/20 px-1 rounded">{Math.round(layer.opacity * 100)}%</span>
          </div>
        ))}
      </div>
      <div className="p-2 border-t border-gray-700 flex justify-between">
         <button onClick={handleAddLayer} className="p-1 hover:bg-gray-700 rounded text-gray-300" title="New Layer">
           <Plus size={20} />
         </button>
         <button onClick={handleRemoveLayer} className="p-1 hover:bg-gray-700 rounded text-gray-300" title="Delete Layer">
           <Trash2 size={20} />
         </button>
         <button className="p-1 hover:bg-gray-700 rounded text-gray-300" title="Duplicate Layer">
           <Copy size={20} />
         </button>
      </div>
    </div>
  );
};
