'use client';
import { useState, useRef, useEffect } from 'react';
import FileDropzone from '../FileDropzone';
import { Download, Camera, Sliders, Printer } from 'lucide-react';

interface PhotoStandard {
  name: string;
  widthMm: number;
  heightMm: number;
  aspectRatio: number;
  pxWidth: number;
  pxHeight: number;
}

const STANDARDS: PhotoStandard[] = [
  { name: 'US Passport / Visa (2 x 2 in / 51 x 51 mm)', widthMm: 51, heightMm: 51, aspectRatio: 1, pxWidth: 600, pxHeight: 600 },
  { name: 'UK / Europe / Schengen (35 x 45 mm)', widthMm: 35, heightMm: 45, aspectRatio: 35 / 45, pxWidth: 413, pxHeight: 531 },
  { name: 'Pakistan / India Passport (35 x 45 mm)', widthMm: 35, heightMm: 45, aspectRatio: 35 / 45, pxWidth: 413, pxHeight: 531 },
  { name: 'Square 1 x 1 inch (25 x 25 mm)', widthMm: 25, heightMm: 25, aspectRatio: 1, pxWidth: 300, pxHeight: 300 }
];

export default function PassportPhotoMaker() {
  const [file, setFile] = useState<File | null>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [selectedStandard, setSelectedStandard] = useState<PhotoStandard>(STANDARDS[0]);
  const [zoom, setZoom] = useState<number>(1.2);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    const img = new Image();
    img.onload = () => {
      setImageObj(img);
      setZoom(1.2);
      setPanX(0);
      setPanY(0);
    };
    img.src = url;
  };

  useEffect(() => {
    if (!imageObj || !previewCanvasRef.current) return;
    drawPreview();
  }, [imageObj, selectedStandard, zoom, panX, panY, bgColor]);

  const drawPreview = () => {
    if (!imageObj || !previewCanvasRef.current) return;
    const canvas = previewCanvasRef.current;
    canvas.width = selectedStandard.pxWidth;
    canvas.height = selectedStandard.pxHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background fill
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate dimensions to cover canvas with zoom
    const imgRatio = imageObj.width / imageObj.height;
    const targetRatio = canvas.width / canvas.height;

    let baseW = canvas.width;
    let baseH = canvas.height;

    if (imgRatio > targetRatio) {
      baseW = canvas.height * imgRatio;
    } else {
      baseH = canvas.width / imgRatio;
    }

    const drawW = baseW * zoom;
    const drawH = baseH * zoom;
    const drawX = (canvas.width - drawW) / 2 + panX;
    const drawY = (canvas.height - drawH) / 2 + panY;

    ctx.drawImage(imageObj, drawX, drawY, drawW, drawH);

    // Overlay subtle face positioning guide
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    // Head guide oval
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, canvas.height * 0.42, canvas.width * 0.28, canvas.height * 0.3, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Eye level guide line
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.2, canvas.height * 0.42);
    ctx.lineTo(canvas.width * 0.8, canvas.height * 0.42);
    ctx.stroke();
  };

  const downloadSinglePhoto = () => {
    if (!imageObj) return;
    // Render clean photo without guide lines
    const offCanvas = document.createElement('canvas');
    offCanvas.width = selectedStandard.pxWidth;
    offCanvas.height = selectedStandard.pxHeight;
    const ctx = offCanvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, offCanvas.width, offCanvas.height);

    const imgRatio = imageObj.width / imageObj.height;
    const targetRatio = offCanvas.width / offCanvas.height;
    let baseW = offCanvas.width;
    let baseH = offCanvas.height;
    if (imgRatio > targetRatio) {
      baseW = offCanvas.height * imgRatio;
    } else {
      baseH = offCanvas.width / imgRatio;
    }
    const drawW = baseW * zoom;
    const drawH = baseH * zoom;
    const drawX = (offCanvas.width - drawW) / 2 + panX;
    const drawY = (offCanvas.height - drawH) / 2 + panY;

    ctx.drawImage(imageObj, drawX, drawY, drawW, drawH);

    const url = offCanvas.toDataURL('image/jpeg', 0.95);
    const a = document.createElement('a');
    a.href = url;
    a.download = `passport_photo_${selectedStandard.pxWidth}x${selectedStandard.pxHeight}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadPrintSheet = () => {
    if (!imageObj) return;
    // Standard 4x6 inch photographic sheet (1200 x 1800 px at 300 DPI)
    const sheetCanvas = document.createElement('canvas');
    sheetCanvas.width = 1800;
    sheetCanvas.height = 1200;
    const sCtx = sheetCanvas.getContext('2d');
    if (!sCtx) return;

    // Pure white sheet
    sCtx.fillStyle = '#FFFFFF';
    sCtx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height);

    // Single photo canvas
    const singleCanvas = document.createElement('canvas');
    singleCanvas.width = selectedStandard.pxWidth;
    singleCanvas.height = selectedStandard.pxHeight;
    const cCtx = singleCanvas.getContext('2d');
    if (!cCtx) return;
    cCtx.fillStyle = bgColor;
    cCtx.fillRect(0, 0, singleCanvas.width, singleCanvas.height);

    const imgRatio = imageObj.width / imageObj.height;
    const targetRatio = singleCanvas.width / singleCanvas.height;
    let baseW = singleCanvas.width;
    let baseH = singleCanvas.height;
    if (imgRatio > targetRatio) {
      baseW = singleCanvas.height * imgRatio;
    } else {
      baseH = singleCanvas.width / imgRatio;
    }
    cCtx.drawImage(imageObj, (singleCanvas.width - baseW * zoom) / 2 + panX, (singleCanvas.height - baseH * zoom) / 2 + panY, baseW * zoom, baseH * zoom);

    // Grid layout: 2 rows x 3 columns = 6 photos
    const cols = 3;
    const rows = 2;
    const pW = selectedStandard.pxWidth;
    const pH = selectedStandard.pxHeight;
    const gapX = (sheetCanvas.width - (cols * pW)) / (cols + 1);
    const gapY = (sheetCanvas.height - (rows * pH)) / (rows + 1);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = gapX + c * (pW + gapX);
        const y = gapY + r * (pH + gapY);
        // Draw photo
        sCtx.drawImage(singleCanvas, x, y, pW, pH);
        // Draw thin gray cut border
        sCtx.strokeStyle = '#D1D5DB';
        sCtx.lineWidth = 1;
        sCtx.strokeRect(x, y, pW, pH);
      }
    }

    const url = sheetCanvas.toDataURL('image/jpeg', 0.95);
    const a = document.createElement('a');
    a.href = url;
    a.download = `printable_4x6_passport_sheet.jpg`;
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
          label="Upload Portrait Photo or Selfie"
          sublabel="Create biometric passport and visa compliant photos with printable sheet"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-800 dark:text-white mb-2">
                Passport / Visa Standard
              </label>
              <select
                value={selectedStandard.name}
                onChange={(e) => {
                  const s = STANDARDS.find(st => st.name === e.target.value);
                  if (s) setSelectedStandard(s);
                }}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              >
                {STANDARDS.map(s => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Adjustments */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 space-y-4">
              <h4 className="font-semibold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-500" />
                Position and Scale Adjustments
              </h4>

              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Zoom / Head Size</span>
                  <span>{zoom.toFixed(1)}x</span>
                </div>
                <input 
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Horizontal Position (Pan X)</span>
                  <span>{panX}px</span>
                </div>
                <input 
                  type="range"
                  min="-200"
                  max="200"
                  step="5"
                  value={panX}
                  onChange={(e) => setPanX(parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Vertical Position (Pan Y)</span>
                  <span>{panY}px</span>
                </div>
                <input 
                  type="range"
                  min="-200"
                  max="200"
                  step="5"
                  value={panY}
                  onChange={(e) => setPanY(parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <span className="block text-xs text-slate-500 mb-2">Background Color</span>
                <div className="flex gap-3">
                  {[
                    { label: 'White', color: '#FFFFFF' },
                    { label: 'Off-White', color: '#F8FAFC' },
                    { label: 'Light Blue', color: '#E0F2FE' },
                    { label: 'Light Gray', color: '#F1F5F9' },
                  ].map(b => (
                    <button
                      key={b.color}
                      onClick={() => setBgColor(b.color)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        bgColor === b.color ? 'border-indigo-600 ring-2 ring-indigo-500/20' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setFile(null);
                setImageObj(null);
              }}
              className="text-xs text-slate-500 hover:text-indigo-600 font-medium"
            >
              &larr; Choose different photo
            </button>
          </div>

          {/* Preview & Action Area */}
          <div className="lg:col-span-5 flex flex-col items-center p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="relative p-2 bg-white rounded-2xl shadow-md border border-slate-200">
              <canvas
                ref={previewCanvasRef}
                className="max-w-[220px] sm:max-w-[260px] w-full h-auto rounded-lg shadow-inner"
              />
              <span className="absolute bottom-3 left-0 right-0 text-center text-[10px] text-indigo-600 font-medium bg-white/80 py-0.5 backdrop-blur-xs">
                Blue dashed line shows biometric eye/head guide
              </span>
            </div>

            <div className="w-full space-y-3">
              <button
                onClick={downloadSinglePhoto}
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Single Photo ({selectedStandard.widthMm}x{selectedStandard.heightMm}mm)
              </button>

              <button
                onClick={downloadPrintSheet}
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-slate-800 dark:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4 text-indigo-500" />
                Download 4x6 Printable Sheet (6 Photos)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
