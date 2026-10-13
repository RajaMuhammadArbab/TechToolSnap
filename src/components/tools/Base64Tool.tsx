'use client';
import { useState } from 'react';
import { Copy, Check, ArrowRightLeft, Trash2 } from 'lucide-react';

export default function Base64Tool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [urlSafe, setUrlSafe] = useState(false);

  const processText = (text: string, currentMode: 'encode' | 'decode', isUrlSafe: boolean) => {
    if (!text) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      if (currentMode === 'encode') {
        // UTF-8 friendly encode
        const bytes = new TextEncoder().encode(text);
        let binary = '';
        bytes.forEach((b) => (binary += String.fromCharCode(b)));
        let encoded = btoa(binary);
        if (isUrlSafe) {
          encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        }
        setOutput(encoded);
        setError(null);
      } else {
        // Decode
        let sanitized = text.trim();
        if (isUrlSafe || sanitized.includes('-') || sanitized.includes('_')) {
          sanitized = sanitized.replace(/-/g, '+').replace(/_/g, '/');
          while (sanitized.length % 4) {
            sanitized += '=';
          }
        }
        const binary = atob(sanitized);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const decoded = new TextDecoder().decode(bytes);
        setOutput(decoded);
        setError(null);
      }
    } catch (e: any) {
      setError(currentMode === 'decode' ? 'Invalid Base64 string. Check for missing or corrupted characters.' : e.message);
      setOutput('');
    }
  };

  const handleInputChange = (val: string) => {
    setInput(val);
    processText(val, mode, urlSafe);
  };

  const toggleMode = () => {
    const nextMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(nextMode);
    setInput(output);
    processText(output, nextMode, urlSafe);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher & Options */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#11141C] border border-[#EAE6DF] dark:border-[#202532]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setMode('encode'); processText(input, 'encode', urlSafe); }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'encode'
                ? 'bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827] shadow-xs'
                : 'bg-white dark:bg-[#171A23] text-slate-700 dark:text-slate-300 border border-[#EAE6DF] dark:border-[#262B38]'
            }`}
          >
            Encode to Base64
          </button>
          <button
            onClick={() => { setMode('decode'); processText(input, 'decode', urlSafe); }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'decode'
                ? 'bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827] shadow-xs'
                : 'bg-white dark:bg-[#171A23] text-slate-700 dark:text-slate-300 border border-[#EAE6DF] dark:border-[#262B38]'
            }`}
          >
            Decode from Base64
          </button>
          <button
            onClick={toggleMode}
            className="p-2 rounded-xl bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white"
            title="Swap Input & Output"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(e) => {
                setUrlSafe(e.target.checked);
                processText(input, mode, e.target.checked);
              }}
              className="rounded accent-[#F5B301]"
            />
            <span>URL-Safe Base64</span>
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

      {/* Inputs Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            <span>{mode === 'encode' ? 'Plain Text Input (UTF-8)' : 'Base64 Encoded Input'}</span>
            <span>{input.length} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={mode === 'encode' ? 'Type or paste plain text here...' : 'Paste Base64 string here (e.g. UXVpY2tUb29sc0h1Yg==)...'}
            className="w-full h-72 p-4 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] font-mono text-xs sm:text-sm text-[#111827] dark:text-[#F3F4F6] focus:outline-none focus:border-[#F5B301] resize-none"
            spellCheck={false}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            <span>{mode === 'encode' ? 'Base64 Result' : 'Decoded Plain Text'}</span>
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
            placeholder="Result appears here live..."
            className="w-full h-72 p-4 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-[#FAF8F5]/80 dark:bg-[#11141C] font-mono text-xs sm:text-sm text-[#111827] dark:text-[#F3F4F6] focus:outline-none resize-none"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
