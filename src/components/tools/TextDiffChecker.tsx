'use client';
import { useState, useMemo } from 'react';
import { ArrowLeftRight, Check, Copy } from 'lucide-react';

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
  originalIndex?: number;
  modifiedIndex?: number;
}

// Client-side Myers-inspired LCS line diff
function computeLineDiff(original: string, modified: string): { diffs: DiffLine[]; additions: number; deletions: number } {
  const origLines = original ? original.split('\n') : [];
  const modLines = modified ? modified.split('\n') : [];

  const n = origLines.length;
  const m = modLines.length;

  // LCS Matrix
  const dp: number[][] = Array(n + 1).fill(0).map(() => Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (origLines[i - 1] === modLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to build diffs
  const diffs: DiffLine[] = [];
  let i = n, j = m;
  let additions = 0, deletions = 0;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origLines[i - 1] === modLines[j - 1]) {
      diffs.unshift({ type: 'unchanged', text: origLines[i - 1], originalIndex: i, modifiedIndex: j });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      diffs.unshift({ type: 'added', text: modLines[j - 1], modifiedIndex: j });
      additions++;
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      diffs.unshift({ type: 'removed', text: origLines[i - 1], originalIndex: i });
      deletions++;
      i--;
    }
  }

  return { diffs, additions, deletions };
}

export default function TextDiffChecker() {
  const [origText, setOrigText] = useState(`function calculateTotal(subtotal, taxRate) {
  const tax = subtotal * taxRate;
  const grandTotal = subtotal + tax;
  return grandTotal;
}`);
  const [modText, setModText] = useState(`function calculateTotal(subtotal, taxRate, discount = 0) {
  const discounted = Math.max(0, subtotal - discount);
  const tax = discounted * taxRate;
  const grandTotal = discounted + tax;
  return Number(grandTotal.toFixed(2));
}`);

  const { diffs, additions, deletions } = useMemo(() => {
    return computeLineDiff(origText, modText);
  }, [origText, modText]);

  const swapText = () => {
    const temp = origText;
    setOrigText(modText);
    setModText(temp);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Metrics */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#11141C] border border-[#EAE6DF] dark:border-[#202532] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs font-bold">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            +{additions} Additions
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
            -{deletions} Deletions
          </span>
          <span className="text-slate-500 font-normal">
            Total lines compared: {diffs.length}
          </span>
        </div>

        <button
          onClick={swapText}
          className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-slate-700 dark:text-slate-300 flex items-center gap-1.5 hover:border-[#F5B301]"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Swap Inputs</span>
        </button>
      </div>

      {/* Input Editors Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
            Original Text (Before)
          </label>
          <textarea
            value={origText}
            onChange={(e) => setOrigText(e.target.value)}
            placeholder="Paste original code or text here..."
            className="w-full h-56 p-4 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] font-mono text-xs sm:text-sm text-[#111827] dark:text-[#F3F4F6] focus:outline-none focus:border-[#F5B301] resize-none"
            spellCheck={false}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
            Modified Text (After)
          </label>
          <textarea
            value={modText}
            onChange={(e) => setModText(e.target.value)}
            placeholder="Paste modified code or text here..."
            className="w-full h-56 p-4 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] font-mono text-xs sm:text-sm text-[#111827] dark:text-[#F3F4F6] focus:outline-none focus:border-[#F5B301] resize-none"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Unified Diff Visualization View */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          Visual Line-by-Line Comparison
        </h3>
        <div className="rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] overflow-hidden divide-y divide-[#F2EFE9] dark:divide-[#202532] font-mono text-xs sm:text-sm">
          {diffs.map((d, idx) => (
            <div
              key={idx}
              className={`flex items-start px-3 py-1.5 transition-colors ${
                d.type === 'added'
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300'
                  : d.type === 'removed'
                  ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-300'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="w-6 shrink-0 text-slate-400 select-none font-bold">
                {d.type === 'added' ? '+' : d.type === 'removed' ? '-' : ' '}
              </span>
              <span className="whitespace-pre-wrap break-all flex-grow">
                {d.text || '\u00A0'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
