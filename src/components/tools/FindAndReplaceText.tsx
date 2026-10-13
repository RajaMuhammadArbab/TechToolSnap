'use client';
import { useState, useMemo } from 'react';
import { Copy, Check, Trash2, Replace } from 'lucide-react';

export default function FindAndReplaceText() {
  const [sourceText, setSourceText] = useState(`The quick brown fox jumps over the lazy dog. A quick fox is never caught.`);
  const [findStr, setFindStr] = useState('quick');
  const [replaceStr, setReplaceStr] = useState('agile');
  const [matchCase, setMatchCase] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Compute replacements
  const { resultText, count } = useMemo(() => {
    if (!findStr || !sourceText) {
      setError(null);
      return { resultText: sourceText, count: 0 };
    }

    try {
      let reg: RegExp;
      const flags = matchCase ? 'g' : 'gi';

      if (useRegex) {
        reg = new RegExp(findStr, flags);
      } else {
        const escaped = findStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = wholeWord ? `\\b${escaped}\\b` : escaped;
        reg = new RegExp(pattern, flags);
      }

      let matches = 0;
      const res = sourceText.replace(reg, () => {
        matches++;
        return replaceStr;
      });

      setError(null);
      return { resultText: res, count: matches };
    } catch (e: any) {
      setError(e.message || 'Invalid regular expression');
      return { resultText: sourceText, count: 0 };
    }
  }, [sourceText, findStr, replaceStr, matchCase, wholeWord, useRegex]);

  const handleCopy = () => {
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Search & Replace Parameters Box */}
      <div className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#11141C] border border-[#EAE6DF] dark:border-[#202532] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Find String or Pattern
            </label>
            <input
              type="text"
              value={findStr}
              onChange={(e) => setFindStr(e.target.value)}
              placeholder="Text to find..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] font-mono focus:border-[#F5B301]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Replace With
            </label>
            <input
              type="text"
              value={replaceStr}
              onChange={(e) => setReplaceStr(e.target.value)}
              placeholder="Replacement text..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] font-mono focus:border-[#F5B301]"
            />
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#EAE6DF] dark:border-[#262B38]">
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={matchCase}
                onChange={(e) => setMatchCase(e.target.checked)}
                className="rounded accent-[#F5B301]"
              />
              <span>Match Case</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={wholeWord}
                disabled={useRegex}
                onChange={(e) => setWholeWord(e.target.checked)}
                className="rounded accent-[#F5B301] disabled:opacity-50"
              />
              <span>Match Whole Word Only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useRegex}
                onChange={(e) => setUseRegex(e.target.checked)}
                className="rounded accent-[#F5B301]"
              />
              <span>Use Regular Expression</span>
            </label>
          </div>

          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {count} {count === 1 ? 'replacement made' : 'replacements made'}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 text-xs font-mono">
          Regex Error: {error}
        </div>
      )}

      {/* Editor & Viewer Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            <span>Source Text</span>
            <button
              onClick={() => setSourceText('')}
              className="text-slate-400 hover:text-red-500 normal-case"
            >
              Clear
            </button>
          </div>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="w-full h-80 p-4 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] text-xs sm:text-sm text-[#111827] dark:text-[#F3F4F6] focus:outline-none focus:border-[#F5B301] resize-none leading-relaxed"
            spellCheck={false}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            <span>Replaced Output</span>
            {resultText && (
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
            value={resultText}
            placeholder="Updated text will appear here..."
            className="w-full h-80 p-4 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-[#FAF8F5]/80 dark:bg-[#11141C] text-xs sm:text-sm text-[#111827] dark:text-[#F3F4F6] focus:outline-none resize-none leading-relaxed"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
