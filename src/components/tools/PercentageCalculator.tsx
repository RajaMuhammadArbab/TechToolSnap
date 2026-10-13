'use client';
import { useState } from 'react';
import { Percent, ArrowRight, RefreshCw } from 'lucide-react';

export default function PercentageCalculator() {
  // Mode 1: What is X% of Y?
  const [val1A, setVal1A] = useState<string>('15');
  const [val1B, setVal1B] = useState<string>('200');

  // Mode 2: X is what percent of Y?
  const [val2A, setVal2A] = useState<string>('45');
  const [val2B, setVal2B] = useState<string>('180');

  // Mode 3: Percentage Increase / Decrease from X to Y
  const [val3A, setVal3A] = useState<string>('80');
  const [val3B, setVal3B] = useState<string>('120');

  // Mode 4: Add / Subtract X% to Y
  const [val4Amount, setVal4Amount] = useState<string>('150');
  const [val4Percent, setVal4Percent] = useState<string>('20');
  const [val4Op, setVal4Op] = useState<'add' | 'subtract'>('subtract');

  // Calc 1
  const res1 = (() => {
    const a = parseFloat(val1A);
    const b = parseFloat(val1B);
    if (isNaN(a) || isNaN(b)) return null;
    return ((a / 100) * b).toFixed(2);
  })();

  // Calc 2
  const res2 = (() => {
    const a = parseFloat(val2A);
    const b = parseFloat(val2B);
    if (isNaN(a) || isNaN(b) || b === 0) return null;
    return ((a / b) * 100).toFixed(2);
  })();

  // Calc 3
  const res3 = (() => {
    const a = parseFloat(val3A);
    const b = parseFloat(val3B);
    if (isNaN(a) || isNaN(b) || a === 0) return null;
    const diff = ((b - a) / Math.abs(a)) * 100;
    return {
      percent: Math.abs(diff).toFixed(2),
      isIncrease: diff >= 0
    };
  })();

  // Calc 4
  const res4 = (() => {
    const amt = parseFloat(val4Amount);
    const pct = parseFloat(val4Percent);
    if (isNaN(amt) || isNaN(pct)) return null;
    const delta = (amt * pct) / 100;
    const total = val4Op === 'add' ? amt + delta : amt - delta;
    return {
      delta: delta.toFixed(2),
      total: total.toFixed(2)
    };
  })();

  return (
    <div className="space-y-8">
      {/* Tool 1: What is X% of Y? */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Percent className="w-4 h-4 text-indigo-500" />
          1. Calculate Percentage of a Number
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">What is</span>
          <div className="relative w-28">
            <input
              type="number"
              value={val1A}
              onChange={(e) => setVal1A(e.target.value)}
              className="w-full px-3 py-2 pr-7 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-center focus:ring-2 focus:ring-indigo-500"
            />
            <span className="absolute right-2.5 top-2 text-slate-400 text-sm font-bold">%</span>
          </div>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">of</span>
          <input
            type="number"
            value={val1B}
            onChange={(e) => setVal1B(e.target.value)}
            className="w-32 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-center focus:ring-2 focus:ring-indigo-500"
          />
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <div className="px-5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-bold text-lg min-w-[100px] text-center">
            {res1 !== null ? res1 : '—'}
          </div>
        </div>
      </div>

      {/* Tool 2: X is what % of Y? */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Percent className="w-4 h-4 text-indigo-500" />
          2. Calculate Percentage Ratio
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            value={val2A}
            onChange={(e) => setVal2A(e.target.value)}
            className="w-28 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-center focus:ring-2 focus:ring-indigo-500"
          />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">is what percent of</span>
          <input
            type="number"
            value={val2B}
            onChange={(e) => setVal2B(e.target.value)}
            className="w-32 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-center focus:ring-2 focus:ring-indigo-500"
          />
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <div className="px-5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-bold text-lg min-w-[100px] text-center">
            {res2 !== null ? `${res2}%` : '—'}
          </div>
        </div>
      </div>

      {/* Tool 3: Percentage Change (Increase/Decrease) */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Percent className="w-4 h-4 text-indigo-500" />
          3. Percentage Increase or Decrease
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">From</span>
          <input
            type="number"
            value={val3A}
            onChange={(e) => setVal3A(e.target.value)}
            className="w-28 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-center focus:ring-2 focus:ring-indigo-500"
          />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">to</span>
          <input
            type="number"
            value={val3B}
            onChange={(e) => setVal3B(e.target.value)}
            className="w-32 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-center focus:ring-2 focus:ring-indigo-500"
          />
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <div className={`px-5 py-2 rounded-xl border font-bold text-lg min-w-[140px] text-center ${
            res3?.isIncrease 
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400' 
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400'
          }`}>
            {res3 !== null ? `${res3.isIncrease ? '+' : '-'}${res3.percent}%` : '—'}
          </div>
        </div>
      </div>

      {/* Tool 4: Discount & Sales Tax (Add / Subtract %) */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Percent className="w-4 h-4 text-indigo-500" />
          4. Discount or Tax Calculator (Add / Subtract %)
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setVal4Op('subtract')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                val4Op === 'subtract' ? 'bg-white dark:bg-slate-700 text-rose-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Discount (-%)
            </button>
            <button
              onClick={() => setVal4Op('add')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                val4Op === 'add' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Tax (+%)
            </button>
          </div>
          <input
            type="number"
            value={val4Percent}
            onChange={(e) => setVal4Percent(e.target.value)}
            className="w-20 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-center focus:ring-2 focus:ring-indigo-500"
          />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">% on</span>
          <input
            type="number"
            value={val4Amount}
            onChange={(e) => setVal4Amount(e.target.value)}
            className="w-28 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-center focus:ring-2 focus:ring-indigo-500"
          />
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <div className="px-5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 font-bold text-lg min-w-[120px] text-center">
            {res4 !== null ? res4.total : '—'}
          </div>
        </div>
      </div>
    </div>
  );
}
