'use client';
import { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, Shield, KeyRound, Lock } from 'lucide-react';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const generatePassword = () => {
    let charset = '';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let u = uppercase;
    let l = lowercase;
    let n = numbers;
    let s = symbols;

    if (excludeAmbiguous) {
      u = u.replace(/[O]/g, '');
      l = l.replace(/[l|i|o]/g, '');
      n = n.replace(/[0|1]/g, '');
      s = s.replace(/[|]/g, '');
    }

    if (includeUpper) charset += u;
    if (includeLower) charset += l;
    if (includeNumbers) charset += n;
    if (includeSymbols) charset += s;

    if (!charset) {
      setPassword('');
      return;
    }

    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset[randomValues[i] % charset.length];
    }

    setPassword(result);
    setCopied(false);
    setHistory(prev => [result, ...prev.filter(p => p !== result)].slice(0, 5));
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeAmbiguous]);

  const copyToClipboard = (textToCopy: string) => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Entropy & strength evaluation
  const evaluateStrength = () => {
    let poolSize = 0;
    if (includeUpper) poolSize += 26;
    if (includeLower) poolSize += 26;
    if (includeNumbers) poolSize += 10;
    if (includeSymbols) poolSize += 28;

    if (poolSize === 0) return { score: 0, text: 'No characters selected', color: 'bg-slate-300' };

    const entropy = length * Math.log2(poolSize);

    if (entropy < 40) return { score: 1, text: 'Weak', color: 'bg-rose-500' };
    if (entropy < 60) return { score: 2, text: 'Fair', color: 'bg-amber-500' };
    if (entropy < 80) return { score: 3, text: 'Strong', color: 'bg-blue-500' };
    return { score: 4, text: 'Ultra Strong (Military-Grade)', color: 'bg-emerald-500' };
  };

  const strength = evaluateStrength();

  return (
    <div className="space-y-8">
      {/* Password display container */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <input
            type="text"
            readOnly
            value={password}
            className="w-full font-mono text-xl sm:text-2xl font-bold text-slate-900 dark:text-white bg-transparent border-none outline-none tracking-wider selection:bg-indigo-500 selection:text-white"
            placeholder="Generated password"
          />
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={generatePassword}
              title="Regenerate"
              aria-label="Regenerate password"
              className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={() => copyToClipboard(password)}
              title="Copy to clipboard"
              aria-label="Copy password to clipboard"
              className="py-3 px-5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="text-sm">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Strength meter bar */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="text-slate-500">Password Strength:</span>
            <span className="text-slate-800 dark:text-white">{strength.text}</span>
          </div>
          <div className="grid grid-cols-4 gap-2 h-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`rounded-full transition-all duration-300 ${
                  strength.score >= step ? strength.color : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Configuration Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Length Slider */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex justify-between items-center">
            <label className="font-bold text-slate-800 dark:text-white text-sm">
              Password Length:
            </label>
            <span className="font-mono font-bold text-lg text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-xl">
              {length}
            </span>
          </div>
          <input
            type="range"
            min="6"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-400 font-medium">
            <span>6 (Min)</span>
            <span>16 (Recommended)</span>
            <span>64 (Max)</span>
          </div>
        </div>

        {/* Character Set Checkboxes */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
          <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-2">
            Character Rules
          </h4>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeUpper}
              onChange={(e) => setIncludeUpper(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Uppercase Letters (A-Z)
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeLower}
              onChange={(e) => setIncludeLower(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Lowercase Letters (a-z)
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Numbers (0-9)
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Special Symbols (!@#$%^&*)
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer pt-1 border-t border-slate-100 dark:border-slate-700">
            <input
              type="checkbox"
              checked={excludeAmbiguous}
              onChange={(e) => setExcludeAmbiguous(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded"
            />
            <span className="text-xs text-slate-500">
              Exclude ambiguous characters (e.g. 0, O, 1, l, I)
            </span>
          </label>
        </div>
      </div>

      {/* Recent History */}
      {history.length > 1 && (
        <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-xs font-semibold uppercase text-slate-400">
            Session History (Not saved to disk)
          </span>
          <div className="space-y-1.5">
            {history.slice(1).map((histPass, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 text-xs font-mono border border-slate-100 dark:border-slate-700"
              >
                <span className="truncate pr-4 text-slate-600 dark:text-slate-300">{histPass}</span>
                <button
                  onClick={() => copyToClipboard(histPass)}
                  className="text-indigo-600 hover:text-indigo-500 font-sans font-semibold flex-shrink-0"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
