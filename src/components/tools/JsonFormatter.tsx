'use client';
import { useState } from 'react';
import { Copy, Check, Trash2, ArrowDownUp } from 'lucide-react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState<number>(2);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{ size: number; keys: number; depth: number } | null>(null);

  const formatJson = () => {
    if (!input.trim()) {
      setError('Please enter some JSON content first.');
      setOutput('');
      setStats(null);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indent);
      setOutput(formatted);
      setError(null);

      // Compute stats
      const countKeys = (obj: any): number => {
        if (typeof obj !== 'object' || obj === null) return 0;
        let count = Object.keys(obj).length;
        for (const k of Object.keys(obj)) {
          count += countKeys(obj[k]);
        }
        return count;
      };

      const getDepth = (obj: any): number => {
        if (typeof obj !== 'object' || obj === null) return 0;
        let max = 0;
        for (const k of Object.keys(obj)) {
          max = Math.max(max, getDepth(obj[k]));
        }
        return max + 1;
      };

      setStats({
        size: new Blob([formatted]).size,
        keys: countKeys(parsed),
        depth: getDepth(parsed),
      });
    } catch (e: any) {
      setError(e.message || 'Invalid JSON syntax.');
      setOutput('');
      setStats(null);
    }
  };

  const minifyJson = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError(null);
      setStats({
        size: new Blob([minified]).size,
        keys: 0,
        depth: 0,
      });
    } catch (e: any) {
      setError(e.message || 'Invalid JSON syntax.');
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => {
    const sample = {
      project: "TechToolSnap",
      version: "2.0.0",
      features: ["Client-Side Only", "No Tracking", "Zero Latency"],
      author: {
        name: "Security Lead",
        verified: true,
        endpoints: 42
      }
    };
    setInput(JSON.stringify(sample));
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#11141C] border border-[#EAE6DF] dark:border-[#202532]">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={formatJson}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827] hover:opacity-90 transition-opacity"
          >
            Prettify JSON
          </button>
          <button
            onClick={minifyJson}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-slate-700 dark:text-slate-300 hover:border-[#F5B301] transition-colors"
          >
            Minify (1 Line)
          </button>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 pl-2">
            <span>Indent:</span>
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="px-2 py-1.5 rounded-lg border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] text-xs"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={1}>Tab</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadSample}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white"
          >
            Load Sample
          </button>
          <button
            onClick={() => { setInput(''); setOutput(''); setError(null); setStats(null); }}
            className="p-2 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
            title="Clear All"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 text-xs sm:text-sm font-mono">
          Parse Error: {error}
        </div>
      )}

      {/* Editor & Viewer Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            <span>Input JSON</span>
            <span>{input.length} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste raw, unformatted, or minified JSON here..."
            className="w-full h-80 sm:h-96 p-4 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] font-mono text-xs sm:text-sm text-[#111827] dark:text-[#F3F4F6] focus:outline-none focus:border-[#F5B301] resize-none"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            <span>Formatted Output</span>
            {output && (
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[#D97706] dark:text-[#F5B301] hover:underline"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Result'}</span>
              </button>
            )}
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Formatted or minified output will appear here..."
            className="w-full h-80 sm:h-96 p-4 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-[#FAF8F5]/80 dark:bg-[#11141C] font-mono text-xs sm:text-sm text-[#111827] dark:text-[#F3F4F6] focus:outline-none resize-none"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Stats summary */}
      {stats && (
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-center">
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400">Payload Size</span>
            <p className="text-base font-extrabold text-[#111827] dark:text-white mt-0.5">{(stats.size / 1024).toFixed(2)} KB</p>
          </div>
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400">Keys Count</span>
            <p className="text-base font-extrabold text-[#111827] dark:text-white mt-0.5">{stats.keys}</p>
          </div>
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400">Object Depth</span>
            <p className="text-base font-extrabold text-[#111827] dark:text-white mt-0.5">{stats.depth} levels</p>
          </div>
        </div>
      )}
    </div>
  );
}
