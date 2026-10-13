'use client';
import { useState } from 'react';
import { Copy, Check, ArrowRightLeft, Trash2 } from 'lucide-react';

export default function UrlEncodeDecode() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [componentOnly, setComponentOnly] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const processUrl = (text: string, currentMode: 'encode' | 'decode', isComponent: boolean) => {
    if (!text) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      if (currentMode === 'encode') {
        const encoded = isComponent ? encodeURIComponent(text) : encodeURI(text);
        setOutput(encoded);
        setError(null);
      } else {
        const decoded = isComponent ? decodeURIComponent(text) : decodeURI(text);
        setOutput(decoded);
        setError(null);
      }
    } catch (e: any) {
      setError(currentMode === 'decode' ? 'URI Malformed. The string contains invalid percent-encoded sequences.' : e.message);
      setOutput('');
    }
  };

  const handleInputChange = (val: string) => {
    setInput(val);
    processUrl(val, mode, componentOnly);
  };

  const toggleMode = () => {
    const nextMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(nextMode);
    setInput(output);
    processUrl(output, nextMode, componentOnly);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#11141C] border border-[#EAE6DF] dark:border-[#202532]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setMode('encode'); processUrl(input, 'encode', componentOnly); }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'encode'
                ? 'bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827] shadow-xs'
                : 'bg-white dark:bg-[#171A23] text-slate-700 dark:text-slate-300 border border-[#EAE6DF] dark:border-[#262B38]'
            }`}
          >
            URL Encode
          </button>
          <button
            onClick={() => { setMode('decode'); processUrl(input, 'decode', componentOnly); }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'decode'
                ? 'bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827] shadow-xs'
                : 'bg-white dark:bg-[#171A23] text-slate-700 dark:text-slate-300 border border-[#EAE6DF] dark:border-[#262B38]'
            }`}
          >
            URL Decode
          </button>
          <button
            onClick={toggleMode}
            className="p-2 rounded-xl bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white"
            title="Swap"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={componentOnly}
              onChange={(e) => {
                setComponentOnly(e.target.checked);
                processUrl(input, mode, e.target.checked);
              }}
              className="rounded accent-[#F5B301]"
            />
            <span>encodeURIComponent (Encodes &amp;, ?, =, /)</span>
          </label>
          <button
            onClick={() => { setInput(''); setOutput(''); setError(null); }}
            className="p-2 rounded-lg text-slate-400 hover:text-red-500"
            title="Clear"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 text-xs sm:text-sm font-mono">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            <span>{mode === 'encode' ? 'Raw URL or String' : 'Percent-Encoded URL (%20, %3F)'}</span>
            <span>{input.length} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={mode === 'encode' ? 'https://example.com/search?q=free online tools & id=42' : 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dfree%20tools'}
            className="w-full h-72 p-4 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] font-mono text-xs sm:text-sm text-[#111827] dark:text-[#F3F4F6] focus:outline-none focus:border-[#F5B301] resize-none"
            spellCheck={false}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            <span>{mode === 'encode' ? 'Encoded Result' : 'Decoded URL'}</span>
            {output && (
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[#D97706] dark:text-[#F5B301] hover:underline"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Result will appear here live..."
            className="w-full h-72 p-4 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-[#FAF8F5]/80 dark:bg-[#11141C] font-mono text-xs sm:text-sm text-[#111827] dark:text-[#F3F4F6] focus:outline-none resize-none"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
