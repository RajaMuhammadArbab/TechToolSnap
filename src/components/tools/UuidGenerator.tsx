'use client';
import { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, Download } from 'lucide-react';

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [version, setVersion] = useState<'v4' | 'nil'>('v4');
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Generate standard RFC4122 v4 UUID with crypto.getRandomValues
  const generateOne = (): string => {
    if (version === 'nil') {
      return hyphens ? '00000000-0000-0000-0000-000000000000' : '00000000000000000000000000000000';
    }
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    // Set version 4 bits: 0100
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    // Set variant bits: 10xx
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    let res = hyphens
      ? `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
      : hex;

    return uppercase ? res.toUpperCase() : res.toLowerCase();
  };

  const regenerate = () => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      list.push(generateOne());
    }
    setUuids(list);
  };

  useEffect(() => {
    regenerate();
  }, [count, version, uppercase, hyphens]);

  const copyOne = (val: string, idx: number) => {
    navigator.clipboard.writeText(val);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const downloadTxt = () => {
    const blob = new Blob([uuids.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids_${count}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Bar */}
      <div className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#11141C] border border-[#EAE6DF] dark:border-[#202532] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Quantity:</span>
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] text-xs font-bold"
              >
                <option value={1}>1 UUID</option>
                <option value={5}>5 UUIDs</option>
                <option value={10}>10 UUIDs</option>
                <option value={25}>25 UUIDs</option>
                <option value={50}>50 UUIDs</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Version:</span>
              <div className="flex gap-1 p-0.5 rounded-xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23]">
                <button
                  onClick={() => setVersion('v4')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg ${version === 'v4' ? 'bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827]' : 'text-slate-500'}`}
                >
                  v4 (Random)
                </button>
                <button
                  onClick={() => setVersion('nil')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg ${version === 'nil' ? 'bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827]' : 'text-slate-500'}`}
                >
                  Nil (0000...)
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={regenerate}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827] flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate New</span>
          </button>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[#EAE6DF] dark:border-[#262B38] text-xs font-semibold text-slate-700 dark:text-slate-300">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hyphens}
              onChange={(e) => setHyphens(e.target.checked)}
              className="rounded accent-[#F5B301]"
            />
            <span>Include Hyphens (8-4-4-4-12)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded accent-[#F5B301]"
            />
            <span>Uppercase Letters</span>
          </label>
        </div>
      </div>

      {/* UUID List Display */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          <span>Generated UUIDs ({uuids.length})</span>
          <div className="flex items-center gap-3">
            <button
              onClick={copyAll}
              className="text-[#D97706] dark:text-[#F5B301] hover:underline flex items-center gap-1"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? 'All Copied' : 'Copy All'}</span>
            </button>
            <button
              onClick={downloadTxt}
              className="hover:underline flex items-center gap-1 text-slate-500"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save .txt</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-[#F2EFE9] dark:divide-[#202532] border border-[#EAE6DF] dark:border-[#262B38] rounded-2xl bg-white dark:bg-[#171A23] overflow-hidden">
          {uuids.map((id, idx) => (
            <div
              key={idx}
              className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-[#FAF8F5] dark:hover:bg-[#1E2330] transition-colors group"
            >
              <span className="font-mono text-xs sm:text-sm text-[#111827] dark:text-[#F3F4F6] select-all truncate">
                {id}
              </span>
              <button
                onClick={() => copyOne(id, idx)}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white flex items-center gap-1 shrink-0"
              >
                {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
