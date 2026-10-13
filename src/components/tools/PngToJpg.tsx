'use client';
import { useState } from 'react';
import FileDropzone from '../FileDropzone';
import { Download, CheckCircle2 } from 'lucide-react';

export default function PngToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [jpgUrl, setJpgUrl] = useState<string | null>(null);
  const [jpgSize, setJpgSize] = useState<number>(0);
  const [quality, setQuality] = useState<number>(90);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertPngToJpg = (selectedFile: File, q: number) => {
    setIsConverting(true);
    setError(null);

    const img = new Image();
    const objectUrl = URL.createObjectURL(selectedFile);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('Canvas not supported');
        setIsConverting(false);
        return;
      }

      // Fill canvas with white background so transparent PNG pixels don't turn black
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        URL.revokeObjectURL(objectUrl);
        if (blob) {
          if (jpgUrl) URL.revokeObjectURL(jpgUrl);
          const convertedUrl = URL.createObjectURL(blob);
          setJpgUrl(convertedUrl);
          setJpgSize(blob.size);
        } else {
          setError('Failed to convert image to JPG.');
        }
        setIsConverting(false);
      }, 'image/jpeg', q / 100);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setError('Could not load image. Please select a valid PNG file.');
      setIsConverting(false);
    };

    img.src = objectUrl;
  };

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.includes('png') && !selectedFile.name.toLowerCase().endsWith('.png')) {
      setError('Please upload a PNG image file.');
      return;
    }
    setFile(selectedFile);
    convertPngToJpg(selectedFile, quality);
  };

  const handleQualityChange = (newQ: number) => {
    setQuality(newQ);
    if (file) {
      convertPngToJpg(file, newQ);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadJpg = () => {
    if (!jpgUrl || !file) return;
    const a = document.createElement('a');
    a.href = jpgUrl;
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    a.download = `${baseName}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <FileDropzone 
          onFileSelect={handleFileSelect}
          accept="image/png"
          label="Upload PNG Image to Convert"
          sublabel="Converts PNG to universal JPG format with clean white background"
        />
      ) : (
        <div className="space-y-6">
          {isConverting && !jpgUrl && (
            <div className="py-12 text-center">
              <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Converting PNG to JPG in browser...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm">
              {error}
              <button onClick={() => setFile(null)} className="ml-2 underline font-medium">Try another</button>
            </div>
          )}

          {jpgUrl && (
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mb-3" />
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                  Conversion Complete!
                </h3>
              </div>

              {/* Quality slider */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <span>JPG Quality: {quality}%</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">
                    {formatBytes(jpgSize)}
                  </span>
                </div>
                <input 
                  type="range"
                  min="30"
                  max="100"
                  step="5"
                  value={quality}
                  onChange={(e) => handleQualityChange(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Smaller Size (30%)</span>
                  <span>Optimal (90%)</span>
                  <span>Maximum (100%)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-xs text-slate-500 uppercase font-semibold">Original PNG</span>
                  <p className="text-xl font-bold text-slate-800 dark:text-white mt-1">{formatBytes(file.size)}</p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-center">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 uppercase font-semibold">Output JPG</span>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatBytes(jpgSize)}</p>
                  <p className="text-xs text-emerald-600 mt-0.5">
                    {file.size > jpgSize ? `${Math.round((1 - jpgSize / file.size) * 100)}% smaller` : 'Optimized'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 flex justify-center max-h-64 overflow-hidden border border-slate-200 dark:border-slate-800">
                <img src={jpgUrl} alt="Converted JPG preview" width={400} height={300} className="max-h-56 w-auto object-contain rounded-lg shadow-sm" />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={downloadJpg}
                  className="py-3.5 px-8 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download JPG Image
                </button>
                <button
                  onClick={() => {
                    setFile(null);
                    setJpgUrl(null);
                  }}
                  className="py-3.5 px-6 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Convert Another Image
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
