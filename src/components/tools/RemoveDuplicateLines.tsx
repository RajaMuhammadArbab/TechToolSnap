'use client';
import { useState } from 'react';
import { Copy, Check, Trash2, ArrowUpDown } from 'lucide-react';

export default function RemoveDuplicateLines() {
  const [input, setInput] = useState(`apple\nbanana\norange\napple\ngrapes\nbanana\nstrawberry\norange`);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimLines, setTrimLines] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [sortAlpha, setSortAlpha] = useState(false);
  const [copied, setCopied] = useState(false);

  // Process text lines
  const rawLines = input.split('\n');
  const seen = new Set<string>();
  const uniqueList: string[] = [];
  let duplicatesCount = 0;

  rawLines.forEach((line) => {
    let cleaned = trimLines ? line.trim() : line;
    if (removeEmpty && cleaned === '') return;

    const lookupKey = caseSensitive ? cleaned : cleaned.toLowerCase();
    if (seen.has(lookupKey)) {
      duplicatesCount++;
    } else {
      seen.add(lookupKey);
      uniqueList.push(cleaned);
    }
  });

  if (sortAlpha) {
    uniqueList.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  }

  const output = uniqueList.join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#11141C] border border-[#EAE6DF] dark:border-[#202532] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
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
              checked={trimLines}
              onChange={(e) => setTrimLines(e.target.checked)}
              className="rounded accent-[#F5B301]"
            />
            <span>Trim Whitespace</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={removeEmpty}
              onChange={(e) => setRemoveEmpty(e.target.checked)}
              className="rounded accent-[#F5B301]"
            />
            <span>Strip Empty Lines</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sortAlpha}
              onChange={(e) => setSortAlpha(e.target.checked)}
              className="rounded accent-[#F5B301]"
            />
            <span>Sort A-Z</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setInput('')}
            className="p-2 rounded-xl text-slate-400 hover:text-red-500 transition-colors"
            title="Clear all text"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-center">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Original Lines</span>
          <p className="text-base sm:text-lg font-extrabold text-[#111827] dark:text-white mt-0.5">{rawLines.length}</p>
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Unique Output</span>
          <p className="text-base sm:text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{uniqueList.length}</p>
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Removed Duplicates</span>
          <p className="text-base sm:text-lg font-extrabold text-[#D97706] dark:text-[#F5B301] mt-0.5">{duplicatesCount}</p>
        </div>
      </div>

      {/* Editors Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
            Original Text / List
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your list with duplicate lines here..."
            className="w-full h-80 p-4 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] font-mono text-xs sm:text-sm text-[#111827] dark:text-[#F3F4F6] focus:outline-none focus:border-[#F5B301] resize-none"
            spellCheck={false}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            <span>Deduplicated Result</span>
            {output && (
              <button
                onClick={handleCopy}
                className="text-[#D97706] dark:text-[#F5B301] hover:underline flex items-center gap-1 font-bold"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Result'}</span>
              </button>
            )}
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Unique lines appear here..."
            className="w-full h-80 p-4 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-[#FAF8F5]/80 dark:bg-[#11141C] font-mono text-xs sm:text-sm text-[#111827] dark:text-[#F3F4F6] focus:outline-none resize-none"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
