'use client';
import { useState, useMemo } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

export default function ColorConverter() {
  const [colorHex, setColorHex] = useState('#F5B301');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Parse any valid hex
  const rgb = useMemo(() => {
    let clean = colorHex.replace('#', '').trim();
    if (clean.length === 3) {
      clean = clean.split('').map(c => c + c).join('');
    }
    if (clean.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(clean)) {
      return { r: 245, g: 179, b: 1 };
    }
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return { r, g, b };
  }, [colorHex]);

  // Convert RGB to HSL
  const hsl = useMemo(() => {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }, [rgb]);

  // Convert RGB to CMYK
  const cmyk = useMemo(() => {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const k = 1 - Math.max(r, g, b);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    const c = Math.round(((1 - r - k) / (1 - k)) * 100);
    const m = Math.round(((1 - g - k) / (1 - k)) * 100);
    const y = Math.round(((1 - b - k) / (1 - k)) * 100);
    return { c, m, y, k: Math.round(k * 100) };
  }, [rgb]);

  const copyVal = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const randomColor = () => {
    const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setColorHex(hex);
  };

  const formats = [
    { label: 'HEX', val: colorHex.toUpperCase(), key: 'hex' },
    { label: 'RGB', val: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, key: 'rgb' },
    { label: 'RGBA', val: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`, key: 'rgba' },
    { label: 'HSL', val: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, key: 'hsl' },
    { label: 'CMYK (Print)', val: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`, key: 'cmyk' },
    { label: 'CSS Variables', val: `--color: ${colorHex};`, key: 'css' },
  ];

  return (
    <div className="space-y-6">
      {/* Visual Color Preview Box & Native Picker */}
      <div className="p-6 rounded-3xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-5 w-full md:w-auto">
          {/* Swatch */}
          <div
            className="w-24 h-24 rounded-2xl shadow-inner border border-black/10 shrink-0 transition-all"
            style={{ backgroundColor: colorHex }}
          />
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Selected Color</span>
            <div className="text-2xl font-extrabold font-mono text-[#111827] dark:text-[#F3F4F6] mt-0.5">
              {colorHex.toUpperCase()}
            </div>
            <p className="text-xs text-slate-500 mt-1">rgb({rgb.r}, {rgb.g}, {rgb.b})</p>
          </div>
        </div>

        {/* Input Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 p-1.5 rounded-xl border border-[#EAE6DF] dark:border-[#262B38] bg-[#FAF8F5] dark:bg-[#11141C]">
            <input
              type="color"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              placeholder="#F5B301"
              className="w-24 px-2 py-1 bg-transparent font-mono text-sm font-bold text-[#111827] dark:text-white uppercase focus:outline-none"
            />
          </div>

          <button
            onClick={randomColor}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827] flex items-center gap-1.5 hover:opacity-90"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Random</span>
          </button>
        </div>
      </div>

      {/* Formats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {formats.map((f) => (
          <div
            key={f.key}
            className="p-5 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] space-y-2 flex flex-col justify-between"
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{f.label}</span>
              <p className="font-mono text-sm sm:text-base font-bold text-[#111827] dark:text-[#F3F4F6] mt-1 break-all select-all">
                {f.val}
              </p>
            </div>
            <button
              onClick={() => copyVal(f.val, f.key)}
              className="pt-2 text-xs font-semibold text-[#D97706] dark:text-[#F5B301] hover:underline flex items-center gap-1"
            >
              {copiedKey === f.key ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === f.key ? 'Copied to Clipboard' : 'Copy Format'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
