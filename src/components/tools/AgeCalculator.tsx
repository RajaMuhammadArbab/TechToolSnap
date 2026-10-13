'use client';
import { useState } from 'react';

export default function AgeCalculator() {
  const [dob, setDob] = useState('');
  const [result, setResult] = useState<{ years: number; months: number; days: number; totalDays: number } | null>(null);

  const calculateAge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob) return;

    const birthDate = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }
    
    const diffTime = Math.abs(today.getTime() - birthDate.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setResult({ years, months, days, totalDays });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={calculateAge} className="bg-slate-50 dark:bg-slate-800/50 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 mb-8">
        <div className="mb-6">
          <label htmlFor="dob" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Date of Birth</label>
          <input
            type="date"
            id="dob"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-4 px-8 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
        >
          Calculate Age
        </button>
      </form>

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-center text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">Your Age Is</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-blue-600 mb-2">{result.years}</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Years</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-blue-600 mb-2">{result.months}</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Months</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-blue-600 mb-2">{result.days}</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Days</div>
            </div>
          </div>
          <div className="text-center p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30">
            <p className="text-slate-700 dark:text-slate-300">
              You have lived for <span className="font-bold text-indigo-600 dark:text-indigo-400">{result.totalDays.toLocaleString()}</span> days total.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
