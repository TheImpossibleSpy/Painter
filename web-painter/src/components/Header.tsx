import React from 'react';
import { useStore } from '../store/useStore';
import { Download, Upload } from 'lucide-react';

export const Header: React.FC = () => {
  const { layers, canvasSize, setLayers, setCanvasSize, setActiveLayerId } = useStore();

  const handleSave = () => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasSize.width;
    tempCanvas.height = canvasSize.height;
    const ctx = tempCanvas.getContext('2d');

    if (!ctx) return;

    // Draw background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    layers.forEach((layer) => {
      if (layer.visible) {
        const layerCanvas = document.getElementById(`canvas-${layer.id}`) as HTMLCanvasElement;
        if (layerCanvas) {
          ctx.globalAlpha = layer.opacity;
          // Map blend modes that are supported by canvas context
          if (layer.blendMode !== 'normal') {
             ctx.globalCompositeOperation = layer.blendMode as GlobalCompositeOperation;
          } else {
             ctx.globalCompositeOperation = 'source-over';
          }
          ctx.drawImage(layerCanvas, 0, 0);
        }
      }
    });

    const link = document.createElement('a');
    link.download = 'painting.png';
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
  };

  const handleOpen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
       // Resize canvas to fit image? Or just center?
       // Let's resize for now.
       setCanvasSize({ width: img.width, height: img.height });

       // Create new layer
       const newLayer = {
         id: `layer-${Date.now()}`,
         name: 'Imported Image',
         visible: true,
         opacity: 1,
         blendMode: 'normal' as const
       };

       // We need to wait for render to draw, which is tricky.
       // Instead, we can update the store, and then use a timeout or effect to draw.
       // Or, we can just replace the layers and let the user see the image.
       // But we need to draw the image data onto the canvas.

       // Strategy: Clear all layers, set one layer.
       setLayers([newLayer]);
       setActiveLayerId(newLayer.id);

       setTimeout(() => {
          const canvas = document.getElementById(`canvas-${newLayer.id}`) as HTMLCanvasElement;
          const ctx = canvas?.getContext('2d');
          if (ctx) {
             ctx.drawImage(img, 0, 0);
          }
       }, 100);
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <div className="h-12 bg-gray-900 border-b border-gray-700 flex items-center px-4 justify-between text-white shadow-md z-20">
      <div className="font-bold text-lg tracking-wide bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Jules Painter</div>

      <div className="flex items-center space-x-4">
         <div className="flex items-center space-x-2 text-sm text-gray-400">
             <span>W:</span>
             <input
               type="number"
               value={canvasSize.width}
               onChange={(e) => setCanvasSize({ ...canvasSize, width: Number(e.target.value) })}
               className="w-16 bg-gray-800 border border-gray-700 rounded px-1 text-white"
             />
             <span>H:</span>
             <input
               type="number"
               value={canvasSize.height}
               onChange={(e) => setCanvasSize({ ...canvasSize, height: Number(e.target.value) })}
               className="w-16 bg-gray-800 border border-gray-700 rounded px-1 text-white"
             />
         </div>

         <div className="h-6 w-px bg-gray-700 mx-2"></div>

        <label className="flex items-center space-x-1 cursor-pointer hover:bg-gray-800 px-3 py-1.5 rounded transition-colors text-sm font-medium text-gray-300 hover:text-white">
          <Upload size={16} />
          <span>Open</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleOpen} />
        </label>
        <button onClick={handleSave} className="flex items-center space-x-1 hover:bg-gray-800 px-3 py-1.5 rounded transition-colors text-sm font-medium text-gray-300 hover:text-white">
          <Download size={16} />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
};
