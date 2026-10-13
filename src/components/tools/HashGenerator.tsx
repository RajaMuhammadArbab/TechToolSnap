'use client';
import { useState, useEffect } from 'react';
import { Copy, Check, Hash, ShieldCheck, Lock } from 'lucide-react';

export default function HashGenerator() {
  const [input, setInput] = useState('TechToolSnap');
  const [hashes, setHashes] = useState<Record<string, string>>({
    'SHA-1': '',
    'SHA-256': '',
    'SHA-384': '',
    'SHA-512': '',
  });
  const [uppercase, setUppercase] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Digest using native Web Crypto API
  const calculateHashes = async (text: string) => {
    if (!text) {
      setHashes({ 'SHA-1': '', 'SHA-256': '', 'SHA-384': '', 'SHA-512': '' });
      return;
    }

    const enc = new TextEncoder();
    const data = enc.encode(text);
    const algos = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
    const results: Record<string, string> = {};

    for (const algo of algos) {
      try {
        const hashBuf = await window.crypto.subtle.digest(algo, data);
        const hashArr = Array.from(new Uint8Array(hashBuf));
        const hashHex = hashArr.map(b => b.toString(16).padStart(2, '0')).join('');
        results[algo] = uppercase ? hashHex.toUpperCase() : hashHex;
      } catch (e) {
        results[algo] = 'Error generating hash';
      }
    }
    setHashes(results);
  };

  useEffect(() => {
    calculateHashes(input);
  }, [input, uppercase]);

  const copyVal = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Input area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          <span>Input String to Hash</span>
          <label className="flex items-center gap-2 cursor-pointer normal-case">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded accent-[#F5B301]"
            />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Uppercase Hex</span>
          </label>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste any text or string here..."
          className="w-full h-32 p-4 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] font-mono text-sm text-[#111827] dark:text-[#F3F4F6] focus:outline-none focus:border-[#F5B301] resize-none"
          spellCheck={false}
        />
      </div>

      {/* Hash Results Grid */}
      <div className="space-y-3">
        {Object.entries(hashes).map(([algo, hashVal]) => (
          <div
            key={algo}
            className="p-4 sm:p-5 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-[#F5B301]">
                {algo} Digest ({algo === 'SHA-1' ? '160-bit' : algo === 'SHA-256' ? '256-bit' : algo === 'SHA-384' ? '384-bit' : '512-bit'})
              </span>
              {hashVal && (
                <button
                  onClick={() => copyVal(hashVal, algo)}
                  className="text-xs font-semibold text-[#D97706] dark:text-[#F5B301] hover:underline flex items-center gap-1"
                >
                  {copiedKey === algo ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === algo ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
            <p className="font-mono text-xs sm:text-sm text-[#111827] dark:text-[#F3F4F6] break-all select-all bg-[#FAF8F5] dark:bg-[#11141C] p-3 rounded-xl border border-[#EAE6DF] dark:border-[#202532]">
              {hashVal || '// Hash will appear here...'}
            </p>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="flex items-center gap-2 p-3.5 rounded-xl bg-slate-100 dark:bg-[#171A23] text-xs text-slate-500 dark:text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Cryptographic security guarantee: Hashes are calculated using the browser SubtleCrypto engine. Input strings are never transmitted or saved.</span>
      </div>
    </div>
  );
}
