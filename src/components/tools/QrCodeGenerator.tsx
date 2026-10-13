'use client';
import { useState, useEffect, useRef } from 'react';
import { Download, Copy, Check, QrCode } from 'lucide-react';
import { createQrMatrix } from '@/lib/qrcode';

export default function QrCodeGenerator() {
  const [text, setText] = useState('https://techtoolsnap.com');
  const [fgColor, setFgColor] = useState('#0F172A');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawQrCode();
  }, [text, fgColor, bgColor]);

  const drawQrCode = () => {
    if (!text.trim() || !canvasRef.current) return;
    try {
      const matrix = createQrMatrix(text);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const size = matrix.length;
      const scale = 12; // 12px per module for high-resolution output
      const margin = 4 * scale; // 4-module standard quiet zone
      const totalSize = size * scale + margin * 2;

      canvas.width = totalSize;
      canvas.height = totalSize;

      // Background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, totalSize, totalSize);

      // Foreground modules
      ctx.fillStyle = fgColor;
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (matrix[r][c]) {
            ctx.fillRect(margin + c * scale, margin + r * scale, scale, scale);
          }
        }
      }
    } catch (e) {
      console.error('Error generating QR', e);
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcode_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopy = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (blob && navigator.clipboard && window.ClipboardItem) {
        navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Controls */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-800 dark:text-white mb-2">
            URL or Text Content
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Enter website URL, Wi-Fi details, phone number, or text..."
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Quick presets */}
        <div>
          <span className="block text-xs font-semibold uppercase text-slate-400 mb-2">
            Quick Examples
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setText('https://techtoolsnap.com')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
            >
              Website URL
            </button>
            <button
              onClick={() => setText('WIFI:S:MyHomeWiFi;T:WPA;P:SecretPassword123;;')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
            >
              Wi-Fi Network
            </button>
            <button
              onClick={() => setText('mailto:hello@example.com?subject=Inquiry')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
            >
              Email Address
            </button>
            <button
              onClick={() => setText('tel:+1234567890')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
            >
              Phone Call
            </button>
          </div>
        </div>

        {/* Color pickers */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/60">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              QR Code Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
              />
              <span className="font-mono text-xs text-slate-700 dark:text-slate-300 uppercase">
                {fgColor}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/60">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Background Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
              />
              <span className="font-mono text-xs text-slate-700 dark:text-slate-300 uppercase">
                {bgColor}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* QR Preview & Action Area */}
      <div className="lg:col-span-5 flex flex-col items-center p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="p-4 bg-white rounded-2xl shadow-md border border-slate-200/80">
          <canvas
            ref={canvasRef}
            className="max-w-[240px] sm:max-w-[280px] w-full h-auto aspect-square rounded-lg"
          />
        </div>

        <div className="w-full space-y-3">
          <button
            onClick={handleDownload}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download High-Res PNG
          </button>

          <button
            onClick={handleCopy}
            className="w-full py-3 px-6 rounded-xl font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Image to Clipboard
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
