'use client';
import { useState } from 'react';
import FileDropzone from '../FileDropzone';
import { CheckCircle2, Download, Archive, Trash2, Plus, Sparkles } from 'lucide-react';
import { createZipArchive, ZipFileInput } from '@/lib/zip';

interface CompressedItem {
  id: string;
  originalFile: File;
  compressedFile: File;
  previewUrl: string;
}

interface ImageCompressorProps {
  targetSizeKB?: number;
}

export default function ImageCompressor({ targetSizeKB }: ImageCompressorProps) {
  const [items, setItems] = useState<CompressedItem[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [totalFilesCount, setTotalFilesCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const formatBytes = (bytes: number, decimals = 1) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const compressSingleFile = async (file: File): Promise<File> => {
    const imageCompression = (await import('browser-image-compression')).default;
    const options = {
      maxSizeMB: targetSizeKB ? targetSizeKB / 1024 : 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      onProgress: (p: number) => setProgress(p)
    };
    return await imageCompression(file, options);
  };

  const handleFilesSelect = async (files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      setError('Please select valid image files (JPG, PNG, WebP).');
      return;
    }

    setError(null);
    setIsCompressing(true);
    setProgress(0);
    setTotalFilesCount(imageFiles.length);

    const newItems: CompressedItem[] = [];

    for (let i = 0; i < imageFiles.length; i++) {
      setCurrentFileIndex(i + 1);
      const file = imageFiles[i];
      try {
        const compressed = await compressSingleFile(file);
        newItems.push({
          id: Math.random().toString(36).substring(7),
          originalFile: file,
          compressedFile: compressed,
          previewUrl: URL.createObjectURL(compressed)
        });
      } catch (err) {
        console.error('Error compressing', file.name, err);
      }
    }

    setItems(prev => [...prev, ...newItems]);
    setIsCompressing(false);
  };

  const downloadSingle = (item: CompressedItem) => {
    const a = document.createElement('a');
    a.href = item.previewUrl;
    a.download = `compressed_${item.originalFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAllAsZip = async () => {
    if (items.length === 0) return;
    const zipFiles: ZipFileInput[] = [];

    for (const item of items) {
      const buffer = await item.compressedFile.arrayBuffer();
      zipFiles.push({
        name: `compressed_${item.originalFile.name}`,
        data: new Uint8Array(buffer)
      });
    }

    const zipBlob = await createZipArchive(zipFiles);
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_images_${targetSizeKB ? `${targetSizeKB}kb_` : ''}${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const removeItem = (id: string) => {
    setItems(prev => {
      const item = prev.find(i => i.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter(i => i.id !== id);
    });
  };

  const clearAll = () => {
    items.forEach(i => URL.revokeObjectURL(i.previewUrl));
    setItems([]);
  };

  const totalOriginalBytes = items.reduce((acc, i) => acc + i.originalFile.size, 0);
  const totalCompressedBytes = items.reduce((acc, i) => acc + i.compressedFile.size, 0);
  const totalSavingsPercent = totalOriginalBytes > 0 
    ? Math.round((1 - totalCompressedBytes / totalOriginalBytes) * 100) 
    : 0;

  return (
    <div className="w-full space-y-6">
      {items.length === 0 && !isCompressing && (
        <FileDropzone 
          onFilesSelect={handleFilesSelect}
          multiple={true}
          accept="image/*"
          label={targetSizeKB ? `Upload Images to Compress Under ${targetSizeKB}KB` : "Upload Images to Compress"}
          sublabel="Drag and drop single or multiple images (batch mode supported)"
        />
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 text-center text-sm">
          {error}
          <button onClick={() => setError(null)} className="ml-3 underline font-medium">Dismiss</button>
        </div>
      )}

      {/* Progress display during batch or single compression */}
      {isCompressing && (
        <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span>Compressing File {currentFileIndex} of {totalFilesCount}...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-500">Processing locally in your browser memory...</p>
        </div>
      )}

      {/* Results view (single or batch) */}
      {items.length > 0 && (
        <div className="space-y-6">
          {/* Header Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-gradient-to-br from-indigo-50/60 to-blue-50/60 dark:from-slate-900 dark:to-indigo-950/40 border border-indigo-100 dark:border-indigo-900">
            <div className="text-center">
              <span className="text-xs font-semibold text-slate-500 uppercase">Total Files</span>
              <div className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">{items.length}</div>
            </div>
            <div className="text-center">
              <span className="text-xs font-semibold text-slate-500 uppercase">Original Size</span>
              <div className="text-2xl font-bold text-slate-400 line-through mt-0.5">{formatBytes(totalOriginalBytes)}</div>
            </div>
            <div className="text-center">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase">Compressed Size</span>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {formatBytes(totalCompressedBytes)} ({totalSavingsPercent}% saved)
              </div>
            </div>
          </div>

          {/* Actions toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <label 
                className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <Plus className="w-4 h-4 text-indigo-500" />
                Add More Images
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files) handleFilesSelect(Array.from(e.target.files));
                    e.target.value = '';
                  }}
                />
              </label>
              <button
                onClick={clearAll}
                className="px-3 py-2 text-xs font-semibold text-red-500 hover:text-red-600"
              >
                Clear All
              </button>
            </div>

            {items.length > 1 && (
              <button
                onClick={downloadAllAsZip}
                className="py-2.5 px-6 rounded-xl font-bold text-[#111827] bg-[#F5B301] hover:bg-[#E0A400] transition-all flex items-center gap-2 text-sm shadow-xs"
              >
                <Archive className="w-4 h-4" />
                Download All as ZIP ({items.length} Files)
              </button>
            )}
          </div>

          {/* List of compressed items */}
          <div className="space-y-3">
            {items.map((item) => {
              const saved = Math.round((1 - item.compressedFile.size / item.originalFile.size) * 100);
              return (
                <div 
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
                    <img 
                      src={item.previewUrl} 
                      alt={`Thumbnail of ${item.originalFile.name}`} 
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-800 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate max-w-xs">
                        {item.originalFile.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs mt-1">
                        <span className="text-slate-400 line-through">{formatBytes(item.originalFile.size)}</span>
                        <span>&rarr;</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatBytes(item.compressedFile.size)}</span>
                        <span className="text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                          -{saved}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => downloadSingle(item)}
                      className="py-2 px-4 rounded-xl font-bold text-xs text-[#111827] bg-[#F5B301] hover:bg-[#E0A400] flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      title="Remove"
                      className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
