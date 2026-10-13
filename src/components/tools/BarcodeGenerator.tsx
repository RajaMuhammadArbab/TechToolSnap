'use client';
import { useState, useId, useRef } from 'react';
import { Download, RefreshCw, Barcode } from 'lucide-react';

// Code 128 Character Encodings (Table B for general alphanumeric)
// Each pattern has 6 elements representing bar & space widths summing to 11
const CODE128_PATTERNS: Record<number, string> = {
  0: '212222', 1: '222122', 2: '222221', 3: '121223', 4: '121322', 5: '131222',
  6: '122213', 7: '122312', 8: '132212', 9: '221213', 10: '221312', 11: '231212',
  12: '112232', 13: '122132', 14: '122231', 15: '113222', 16: '123122', 17: '123221',
  18: '223211', 19: '221132', 20: '221231', 21: '213212', 22: '223112', 23: '312131',
  24: '311222', 25: '321122', 26: '321221', 27: '312212', 28: '322112', 29: '322211',
  30: '212123', 31: '212321', 32: '232121', 33: '111323', 34: '131123', 35: '131321',
  36: '112313', 37: '132113', 38: '132311', 39: '211313', 40: '231113', 41: '231311',
  42: '112133', 43: '112331', 44: '132131', 45: '113123', 46: '113321', 47: '133121',
  48: '313121', 49: '211331', 50: '231131', 51: '213113', 52: '213311', 53: '213131',
  54: '311123', 55: '311321', 56: '331121', 57: '312113', 58: '312311', 59: '332111',
  60: '314111', 61: '221411', 62: '431111', 63: '111224', 64: '111422', 65: '121124',
  66: '121421', 67: '141122', 68: '141221', 69: '112214', 70: '112412', 71: '122114',
  72: '122411', 73: '142112', 74: '142211', 75: '241211', 76: '221114', 77: '413111',
  78: '241112', 79: '134111', 80: '111242', 81: '121142', 82: '121241', 83: '114212',
  84: '124112', 85: '124211', 86: '411212', 87: '421112', 88: '421211', 89: '212141',
  90: '214121', 91: '412121', 92: '111143', 93: '111341', 94: '131141', 95: '114113',
  96: '114311', 97: '411113', 98: '411311', 99: '113141', 100: '114131', 101: '311141',
  102: '411131', 103: '211412', 104: '211214', 105: '211232', 106: '2331112'
};

// Encode a string into Code 128 binary bars ('1' = black, '0' = white)
function encodeCode128B(text: string): string {
  const codes: number[] = [104]; // Start Code B
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i) - 32;
    codes.push(code >= 0 && code <= 95 ? code : 0);
  }

  // Calculate Checksum
  let sum = codes[0];
  for (let i = 1; i < codes.length; i++) {
    sum += codes[i] * i;
  }
  codes.push(sum % 103);
  codes.push(106); // Stop Code

  // Convert to bar stream
  let binaryString = '';
  codes.forEach(c => {
    const pattern = CODE128_PATTERNS[c] || '212222';
    for (let i = 0; i < pattern.length; i++) {
      const width = parseInt(pattern[i], 10);
      const isBar = i % 2 === 0;
      binaryString += (isBar ? '1' : '0').repeat(width);
    }
  });

  return binaryString;
}

// Encode Code 39
const CODE39_MAP: Record<string, string> = {
  '0': 'bwbwbwBwb', '1': 'BwbwbwbwB', '2': 'bwBwbwbwB', '3': 'BwBwbwbwb',
  '4': 'bwbwBwbwB', '5': 'BwbwBwbwb', '6': 'bwBwBwbwb', '7': 'bwbwbwBwB',
  '8': 'BwbwbwBwb', '9': 'bwBwbwBwb', 'A': 'BwbwbwbwB', 'B': 'bwBwbwbwB',
  'C': 'BwBwbwbwb', 'D': 'bwbwBwbwB', 'E': 'BwbwBwbwb', 'F': 'bwBwBwbwb',
  'G': 'bwbwbwBwB', 'H': 'BwbwbwBwb', 'I': 'bwBwbwBwb', 'J': 'bwbwBwBwb',
  'K': 'Bwbwbwbwb', 'L': 'bwBwbwbwb', 'M': 'BwBwbwbwb', 'N': 'bwbwBwbwb',
  'O': 'BwbwBwbwb', 'P': 'bwBwBwbwb', 'Q': 'bwbwbwbwB', 'R': 'Bwbwbwbwb',
  'S': 'bwBwbwbwb', 'T': 'bwbwBwbwb', 'U': 'BwBwbwbwb', 'V': 'bwBwBwbwb',
  'W': 'BwBwBwbwb', 'X': 'bwBwbwBwb', 'Y': 'BwBwbwBwb', 'Z': 'bwBwBwBwb',
  '-': 'bwBwbwbwB', '.': 'BwBwbwbwb', ' ': 'bwBwBwbwb', '$': 'bwbwbwbwb',
  '/': 'bwbwbwbwb', '+': 'bwbwbwbwb', '%': 'bwbwbwbwb', '*': 'bwBwbwBwb'
};

function encodeCode39(text: string): string {
  const clean = '*' + text.toUpperCase().replace(/[^0-9A-Z\-\. \$\/\+\%]/g, '') + '*';
  let binary = '';
  for (let i = 0; i < clean.length; i++) {
    const pat = CODE39_MAP[clean[i]] || CODE39_MAP['*'];
    for (let j = 0; j < pat.length; j++) {
      const char = pat[j];
      const isBar = char === 'b' || char === 'B';
      const width = char === 'B' || char === 'W' ? 3 : 1;
      binary += (isBar ? '1' : '0').repeat(width);
    }
    binary += '0'; // Inter-character space
  }
  return binary;
}

export default function BarcodeGenerator() {
  const [format, setFormat] = useState<'CODE128' | 'CODE39'>('CODE128');
  const [value, setValue] = useState('QUICKTOOLS-2026');
  const [barHeight, setBarHeight] = useState(100);
  const [barWidth, setBarWidth] = useState(2);
  const [showText, setShowText] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  // Generate binary pattern
  const binaryBars = format === 'CODE128' 
    ? encodeCode128B(value || ' ') 
    : encodeCode39(value || ' ');

  const totalWidth = binaryBars.length * barWidth + 40;
  const totalHeight = barHeight + (showText ? 40 : 20);

  const downloadSvg = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `barcode_${format}_${value}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPng = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = totalWidth;
      canvas.height = totalHeight;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = `barcode_${format}_${value}.png`;
        a.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="space-y-6">
      {/* Configuration Controls */}
      <div className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#11141C] border border-[#EAE6DF] dark:border-[#202532] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Symbology Standard
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] font-bold"
            >
              <option value="CODE128">Code 128 (Alphanumeric, Shipping)</option>
              <option value="CODE39">Code 39 (Standard Alphanumeric)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Barcode Value / SKU
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. SKU-98471"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] font-mono font-bold focus:border-[#F5B301]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Bar Height ({barHeight}px)
            </label>
            <input
              type="range"
              min="50"
              max="160"
              value={barHeight}
              onChange={(e) => setBarHeight(Number(e.target.value))}
              className="w-full accent-[#F5B301] mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Bar Scale Width ({barWidth}px)
            </label>
            <input
              type="range"
              min="1"
              max="4"
              value={barWidth}
              onChange={(e) => setBarWidth(Number(e.target.value))}
              className="w-full accent-[#F5B301] mt-1"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#EAE6DF] dark:border-[#262B38]">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showText}
              onChange={(e) => setShowText(e.target.checked)}
              className="rounded accent-[#F5B301]"
            />
            <span>Show Text Label Below Barcode</span>
          </label>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadPng}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827] flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG</span>
            </button>
            <button
              onClick={downloadSvg}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-slate-700 dark:text-slate-300 flex items-center gap-1.5 hover:border-[#F5B301] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download SVG</span>
            </button>
          </div>
        </div>
      </div>

      {/* SVG Barcode Canvas Rendering Area */}
      <div className="p-8 sm:p-12 rounded-3xl border border-[#EAE6DF] dark:border-[#262B38] bg-white flex flex-col items-center justify-center min-h-[220px] shadow-sm overflow-x-auto">
        <svg
          ref={svgRef}
          width={totalWidth}
          height={totalHeight}
          viewBox={`0 0 ${totalWidth} ${totalHeight}`}
          className="max-w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* White Background */}
          <rect width={totalWidth} height={totalHeight} fill="#ffffff" />

          {/* Barcode Lines */}
          <g transform="translate(20, 10)">
            {binaryBars.split('').map((bit, idx) => {
              if (bit === '1') {
                return (
                  <rect
                    key={idx}
                    x={idx * barWidth}
                    y={0}
                    width={barWidth}
                    height={barHeight}
                    fill="#111827"
                  />
                );
              }
              return null;
            })}
          </g>

          {/* Text Label */}
          {showText && (
            <text
              x={totalWidth / 2}
              y={barHeight + 28}
              textAnchor="middle"
              fill="#111827"
              fontFamily="monospace"
              fontWeight="bold"
              fontSize="14"
              letterSpacing="2"
            >
              {value}
            </text>
          )}
        </svg>
      </div>
    </div>
  );
}
