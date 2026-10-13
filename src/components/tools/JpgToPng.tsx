'use client';
import { useState } from 'react';
import FileDropzone from '../FileDropzone';
import { Download, CheckCircle2, Image as ImageIcon } from 'lucide-react';

export default function JpgToPng() {
  const [file, setFile] = useState<File | null>(null);
  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const [pngSize, setPngSize] = useState<number>(0);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = (selectedFile: File) => {
    if (!selectedFile.type.includes('jpeg') && !selectedFile.type.includes('jpg') && !selectedFile.name.toLowerCase().match(/\.(jpe?g)$/)) {
      setError('Please upload a JPG or JPEG image.');
      return;
    }
    setError(null);
    setFile(selectedFile);
    setIsConverting(true);

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

      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(objectUrl);
        if (blob) {
          const convertedUrl = URL.createObjectURL(blob);
          setPngUrl(convertedUrl);
          setPngSize(blob.size);
        } else {
          setError('Failed to convert image to PNG.');
        }
        setIsConverting(false);
      }, 'image/png');
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setError('Could not load image. Please try another file.');
      setIsConverting(false);
    };

    img.src = objectUrl;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadPng = () => {
    if (!pngUrl || !file) return;
    const a = document.createElement('a');
    a.href = pngUrl;
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    a.download = `${baseName}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <FileDropzone 
          onFileSelect={handleConvert}
          accept="image/jpeg, image/jpg"
          label="Upload JPG Image to Convert"
          sublabel="Converts JPG/JPEG to high-quality lossless PNG"
        />
      ) : (
        <div className="space-y-6">
          {isConverting && (
            <div className="py-12 text-center">
              <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Converting JPG to PNG in browser...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm">
              {error}
              <button onClick={() => setFile(null)} className="ml-2 underline font-medium">Try another</button>
            </div>
          )}

          {pngUrl && !isConverting && (
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mb-3" />
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                  Conversion Complete!
                </h3>
                <p className="text-sm text-slate-500">Your PNG is ready with zero quality loss.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-xs text-slate-500 uppercase font-semibold">Original JPG</span>
                  <p className="text-xl font-bold text-slate-800 dark:text-white mt-1">{formatBytes(file.size)}</p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-center">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 uppercase font-semibold">Output PNG</span>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatBytes(pngSize)}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 flex justify-center max-h-64 overflow-hidden border border-slate-200 dark:border-slate-800">
                <img src={pngUrl} alt="Converted PNG preview" width={400} height={300} className="max-h-56 w-auto object-contain rounded-lg" />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={downloadPng}
                  className="py-3.5 px-8 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download PNG Image
                </button>
                <button
                  onClick={() => {
                    setFile(null);
                    setPngUrl(null);
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
