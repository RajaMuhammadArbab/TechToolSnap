'use client';
import { useState, useRef, useEffect } from 'react';
import FileDropzone from '../FileDropzone';

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<'pixels' | 'percentage'>('pixels');
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(50);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [originalRatio, setOriginalRatio] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      const img = new Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
        setOriginalRatio(img.width / img.height);
      };
      img.src = url;
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    setWidth(val);
    if (maintainRatio && originalRatio) {
      setHeight(Math.round(val / originalRatio));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    setHeight(val);
    if (maintainRatio && originalRatio) {
      setWidth(Math.round(val * originalRatio));
    }
  };

  const handleResize = () => {
    if (!previewUrl || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      let finalWidth = width;
      let finalHeight = height;
      
      if (mode === 'percentage') {
        finalWidth = Math.round(img.width * (percentage / 100));
        finalHeight = Math.round(img.height * (percentage / 100));
      }

      canvas.width = finalWidth;
      canvas.height = finalHeight;
      ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `resized-${file?.name || 'image.png'}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, file?.type || 'image/png');
    };
    img.src = previewUrl;
  };

  return (
    <div className="w-full">
      {!file ? (
        <FileDropzone onFileSelect={setFile} accept="image/*" label="Upload Image" sublabel="Drag and drop or browse to select" />
      ) : (
        <div className="mt-4">
          {previewUrl && (
            <div className="mb-6 flex justify-center">
              <img 
                src={previewUrl} 
                alt="Uploaded image preview for resizing" 
                width={width || 400} 
                height={height || 300} 
                className="rounded-xl overflow-hidden max-h-64 w-auto object-contain shadow-sm border border-slate-200 dark:border-slate-700" 
              />
            </div>
          )}
          
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 mb-6">
            <div className="flex gap-2 p-1 bg-slate-200 dark:bg-slate-700 rounded-full mb-6 w-max mx-auto">
              <button
                onClick={() => setMode('pixels')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${mode === 'pixels' ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}
              >
                By Pixels
              </button>
              <button
                onClick={() => setMode('percentage')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${mode === 'percentage' ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}
              >
                By Percentage
              </button>
            </div>

            {mode === 'pixels' ? (
              <div className="grid grid-cols-2 gap-4 mb-4 max-w-md mx-auto">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Width (px)</label>
                  <input type="number" value={width} onChange={handleWidthChange} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Height (px)</label>
                  <input type="number" value={height} onChange={handleHeightChange} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                </div>
              </div>
            ) : (
              <div className="mb-4 max-w-md mx-auto">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Scale Percentage: {percentage}%</label>
                <input type="range" min="1" max="200" value={percentage} onChange={(e) => setPercentage(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
              </div>
            )}

            {mode === 'pixels' && (
              <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
                <label className="flex items-center cursor-pointer relative">
                  <input type="checkbox" checked={maintainRatio} onChange={(e) => setMaintainRatio(e.target.checked)} className="sr-only" />
                  <div className={`w-11 h-6 rounded-full transition-colors ${maintainRatio ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                    <div className={`absolute top-[2px] left-[2px] bg-white w-5 h-5 rounded-full transition-transform ${maintainRatio ? 'translate-x-full' : ''}`}></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">Maintain Aspect Ratio</span>
                </label>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleResize}
              className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 px-8 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
            >
              Resize & Download
            </button>
            <button
              onClick={() => setFile(null)}
              className="py-3 px-8 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Start Over
            </button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
}
