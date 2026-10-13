'use client';
import { useState, useMemo } from 'react';
import { Copy, Check, RotateCcw } from 'lucide-react';

export default function ReverseText() {
  const [text, setText] = useState('TechToolSnap provides free and private browser utilities!');
  const [mode, setMode] = useState<'chars' | 'words' | 'lines'>('chars');
  const [copied, setCopied] = useState(false);

  const reversed = useMemo(() => {
    if (!text) return '';
    if (mode === 'chars') {
      // Handles basic unicode multi-byte
      return Array.from(text).reverse().join('');
    } else if (mode === 'words') {
      return text
        .split('\n')
        .map((line) => line.split(/\s+/).reverse().join(' '))
        .join('\n');
    } else {
      // Reverse lines
      return text.split('\n').reverse().join('\n');
    }
  }, [text, mode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(reversed);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Modes */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#11141C] border border-[#EAE6DF] dark:border-[#202532]">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setMode('chars')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold ${
              mode === 'chars'
                ? 'bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827]'
                : 'bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-slate-700 dark:text-slate-300'
            }`}
          >
            Reverse Characters (cba)
          </button>
          <button
            onClick={() => setMode('words')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold ${
              mode === 'words'
                ? 'bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827]'
                : 'bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-slate-700 dark:text-slate-300'
            }`}
          >
            Reverse Words
          </button>
          <button
            onClick={() => setMode('lines')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold ${
              mode === 'lines'
                ? 'bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827]'
                : 'bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-slate-700 dark:text-slate-300'
            }`}
          >
            Reverse Line Order
          </button>
        </div>

        {reversed && (
          <button
            onClick={handleCopy}
            className="text-xs font-bold text-[#D97706] dark:text-[#F5B301] hover:underline flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Output'}</span>
          </button>
        )}
      </div>

      {/* Editor & Viewer Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
            Input Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type text to reverse..."
            className="w-full h-72 p-4 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] text-sm text-[#111827] dark:text-[#F3F4F6] focus:outline-none focus:border-[#F5B301] resize-none leading-relaxed"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
            Reversed Result
          </label>
          <textarea
            readOnly
            value={reversed}
            placeholder="Reversed output appears here..."
            className="w-full h-72 p-4 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-[#FAF8F5]/80 dark:bg-[#11141C] text-sm text-[#111827] dark:text-[#F3F4F6] focus:outline-none resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
