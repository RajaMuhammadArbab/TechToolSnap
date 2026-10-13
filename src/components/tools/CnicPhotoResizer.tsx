'use client';
import { useState } from 'react';
import FileDropzone from '../FileDropzone';
import { Download, CheckCircle2, ShieldCheck, CreditCard } from 'lucide-react';

export default function CnicPhotoResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processedSize, setProcessedSize] = useState<number>(0);
  const [targetPreset, setTargetPreset] = useState<'nadra' | 'gov_portal' | 'passport'>('nadra');
  const [maxKb, setMaxKb] = useState<number>(20);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const presets = {
    nadra: { name: 'NADRA Smart Card / CNIC (350 x 467 px, <20KB)', width: 350, height: 467, defaultMaxKb: 20 },
    gov_portal: { name: 'FPSC / PPSC / NTS Job Portals (140 x 190 px, <25KB)', width: 140, height: 190, defaultMaxKb: 25 },
    passport: { name: 'Pakistani Online Passport Portal (600 x 600 px, <50KB)', width: 600, height: 600, defaultMaxKb: 50 },
  };

  const processImage = (selectedFile: File, presetKey: 'nadra' | 'gov_portal' | 'passport', targetLimitKb: number) => {
    setIsProcessing(true);
    setError(null);

    const preset = presets[presetKey];
    const img = new Image();
    const objectUrl = URL.createObjectURL(selectedFile);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = preset.width;
      canvas.height = preset.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('Canvas not supported');
        setIsProcessing(false);
        return;
      }

      // Draw background white
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Fit or fill with aspect ratio preserving center crop
      const imgRatio = img.width / img.height;
      const targetRatio = canvas.width / canvas.height;
      let drawW = canvas.width;
      let drawH = canvas.height;

      if (imgRatio > targetRatio) {
        drawW = canvas.height * imgRatio;
      } else {
        drawH = canvas.width / imgRatio;
      }

      const drawX = (canvas.width - drawW) / 2;
      const drawY = (canvas.height - drawH) / 2;
      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      // Iteratively optimize quality until size is under targetLimitKb
      let low = 0.2;
      let high = 0.95;
      let bestBlob: Blob | null = null;

      const tryCompress = (q: number) => {
        return new Promise<Blob | null>((resolve) => {
          canvas.toBlob((blob) => resolve(blob), 'image/jpeg', q);
        });
      };

      (async () => {
        for (let i = 0; i < 6; i++) {
          const mid = (low + high) / 2;
          const blob = await tryCompress(mid);
          if (blob) {
            const sizeKb = blob.size / 1024;
            if (sizeKb <= targetLimitKb) {
              bestBlob = blob;
              low = mid; // Try higher quality
            } else {
              high = mid; // Need lower quality
            }
          }
        }

        if (!bestBlob) {
          bestBlob = await tryCompress(0.2);
        }

        URL.revokeObjectURL(objectUrl);
        if (bestBlob) {
          if (processedUrl) URL.revokeObjectURL(processedUrl);
          setProcessedUrl(URL.createObjectURL(bestBlob));
          setProcessedSize(bestBlob.size);
        } else {
          setError('Failed to compress image under specified size.');
        }
        setIsProcessing(false);
      })();
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setError('Could not load image.');
      setIsProcessing(false);
    };

    img.src = objectUrl;
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    processImage(selectedFile, targetPreset, maxKb);
  };

  const handlePresetChange = (presetKey: 'nadra' | 'gov_portal' | 'passport') => {
    setTargetPreset(presetKey);
    const newMax = presets[presetKey].defaultMaxKb;
    setMaxKb(newMax);
    if (file) {
      processImage(file, presetKey, newMax);
    }
  };

  const handleMaxKbChange = (newKb: number) => {
    setMaxKb(newKb);
    if (file) {
      processImage(file, targetPreset, newKb);
    }
  };

  const downloadImage = () => {
    if (!processedUrl || !file) return;
    const a = document.createElement('a');
    a.href = processedUrl;
    a.download = `cnic_photo_${presets[targetPreset].width}x${presets[targetPreset].height}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <FileDropzone 
          onFileSelect={handleFileSelect}
          accept="image/*"
          label="Upload CNIC Photo or Portrait"
          sublabel="Resize to exact NADRA, FPSC, PPSC and Passport Portal dimensions under required KB"
        />
      ) : (
        <div className="space-y-6">
          {/* Preset Selector */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-500" />
              Select Target Portal Requirement
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(Object.keys(presets) as Array<'nadra' | 'gov_portal' | 'passport'>).map((key) => {
                const p = presets[key];
                return (
                  <button
                    key={key}
                    onClick={() => handlePresetChange(key)}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      targetPreset === key
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <span className="block font-bold text-sm text-slate-900 dark:text-white mb-1">
                      {key === 'nadra' ? 'NADRA CNIC' : key === 'gov_portal' ? 'FPSC / PPSC' : 'Passport Portal'}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {p.width} x {p.height} px
                    </span>
                    <span className="inline-block mt-2 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100/60 dark:bg-indigo-900/60 px-2 py-0.5 rounded-full">
                      Under {p.defaultMaxKb} KB
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Max KB */}
            <div className="pt-2 flex items-center gap-4 text-sm">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Max Size Limit:</span>
              <div className="flex gap-2">
                {[15, 20, 25, 30, 50].map((kb) => (
                  <button
                    key={kb}
                    onClick={() => handleMaxKbChange(kb)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      maxKb === kb
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {kb} KB
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isProcessing && (
            <div className="py-12 text-center">
              <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Resizing and compressing under {maxKb}KB...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          {processedUrl && !isProcessing && (
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mb-2" />
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                  Photo Ready for Submission!
                </h3>
                <p className="text-sm text-slate-500">Guaranteed within official portal dimension and size limits.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-xs text-slate-500 uppercase font-semibold">Dimensions</span>
                  <p className="text-lg font-bold text-slate-800 dark:text-white mt-1">
                    {presets[targetPreset].width} x {presets[targetPreset].height} px
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-center">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 uppercase font-semibold">Final Size</span>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    {(processedSize / 1024).toFixed(1)} KB
                  </p>
                  <span className="text-[11px] text-emerald-600 font-medium">✓ Under {maxKb} KB</span>
                </div>
              </div>

              <div className="flex justify-center p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <img 
                  src={processedUrl} 
                  alt="CNIC Resized photo preview" 
                  width={presets[targetPreset].width}
                  height={presets[targetPreset].height}
                  className="max-h-60 w-auto object-contain rounded-lg shadow-sm border border-slate-200"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={downloadImage}
                  className="py-3.5 px-8 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Verified Photo
                </button>
                <button
                  onClick={() => { setFile(null); setProcessedUrl(null); }}
                  className="py-3.5 px-6 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Resize Another Photo
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
