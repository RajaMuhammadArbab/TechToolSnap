'use client';
import { useState } from 'react';
import { Copy, Check, Trash2, ArrowDownAZ } from 'lucide-react';

export default function SortTextLines() {
  const [input, setInput] = useState(`Zebra\napple\nMango\nbanana\nOrange\nItem 10\nItem 2`);
  const [sortMode, setSortMode] = useState<'az' | 'za' | 'natural' | 'numeric' | 'length'>('natural');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [removeDuplicates, setRemoveDuplicates] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sorting logic
  let lines = input.split('\n');
  if (removeDuplicates) {
    const seen = new Set<string>();
    lines = lines.filter((l) => {
      const k = caseSensitive ? l : l.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }

  lines.sort((a, b) => {
    switch (sortMode) {
      case 'az':
        return caseSensitive
          ? a.localeCompare(b)
          : a.localeCompare(b, undefined, { sensitivity: 'base' });
      case 'za':
        return caseSensitive
          ? b.localeCompare(a)
          : b.localeCompare(a, undefined, { sensitivity: 'base' });
      case 'natural':
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
      case 'numeric':
        return (parseFloat(a) || 0) - (parseFloat(b) || 0);
      case 'length':
        return a.length - b.length;
      default:
        return 0;
    }
  });

  const output = lines.join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Configuration bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#11141C] border border-[#EAE6DF] dark:border-[#202532] space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSortMode('natural')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold ${
              sortMode === 'natural'
                ? 'bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827]'
                : 'bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-slate-700 dark:text-slate-300'
            }`}
          >
            Natural (1, 2, 10)
          </button>
          <button
            onClick={() => setSortMode('az')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold ${
              sortMode === 'az'
                ? 'bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827]'
                : 'bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-slate-700 dark:text-slate-300'
            }`}
          >
            A &rarr; Z Alphabetical
          </button>
          <button
            onClick={() => setSortMode('za')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold ${
              sortMode === 'za'
                ? 'bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827]'
                : 'bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-slate-700 dark:text-slate-300'
            }`}
          >
            Z &rarr; A Reverse
          </button>
          <button
            onClick={() => setSortMode('numeric')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold ${
              sortMode === 'numeric'
                ? 'bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827]'
                : 'bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-slate-700 dark:text-slate-300'
            }`}
          >
            Numeric (0 &rarr; 9)
          </button>
          <button
            onClick={() => setSortMode('length')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold ${
              sortMode === 'length'
                ? 'bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827]'
                : 'bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-slate-700 dark:text-slate-300'
            }`}
          >
            By Line Length
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#EAE6DF] dark:border-[#262B38] text-xs font-semibold text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
                className="rounded accent-[#F5B301]"
              />
              <span>Case Sensitive</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={removeDuplicates}
                onChange={(e) => setRemoveDuplicates(e.target.checked)}
                className="rounded accent-[#F5B301]"
              />
              <span>Purge Duplicate Lines</span>
            </label>
          </div>

          <button
            onClick={() => setInput('')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor & Viewer Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
            Unsorted Input Lines ({input.split('\n').length})
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste text lines here..."
            className="w-full h-80 p-4 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] font-mono text-xs sm:text-sm text-[#111827] dark:text-[#F3F4F6] focus:outline-none focus:border-[#F5B301] resize-none"
            spellCheck={false}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            <span>Sorted Output ({lines.length})</span>
            {output && (
              <button
                onClick={handleCopy}
                className="text-[#D97706] dark:text-[#F5B301] hover:underline flex items-center gap-1 font-bold"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Sorted lines will appear here..."
            className="w-full h-80 p-4 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-[#FAF8F5]/80 dark:bg-[#11141C] font-mono text-xs sm:text-sm text-[#111827] dark:text-[#F3F4F6] focus:outline-none resize-none"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
