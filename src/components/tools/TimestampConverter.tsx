'use client';
import { useState, useEffect } from 'react';
import { Copy, Check, Clock, RefreshCw } from 'lucide-react';

export default function TimestampConverter() {
  const [currentEpoch, setCurrentEpoch] = useState<number>(Math.floor(Date.now() / 1000));
  const [epochInput, setEpochInput] = useState<string>('');
  const [dateInput, setDateInput] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live ticker for current epoch
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize inputs with current date
  useEffect(() => {
    const now = new Date();
    setEpochInput(Math.floor(now.getTime() / 1000).toString());
    const pad = (n: number) => n.toString().padStart(2, '0');
    const localIso = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    setDateInput(localIso);
  }, []);

  // Computed conversions from epochInput
  const parsedEpochDate = (() => {
    const num = Number(epochInput);
    if (!epochInput || isNaN(num)) return null;
    // Autodetect seconds vs milliseconds
    const ms = epochInput.length > 10 ? num : num * 1000;
    const d = new Date(ms);
    if (isNaN(d.getTime())) return null;
    return d;
  })();

  // Handle human date change -> update epoch
  const handleDateChange = (val: string) => {
    setDateInput(val);
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      setEpochInput(Math.floor(d.getTime() / 1000).toString());
    }
  };

  const copyVal = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const setNow = () => {
    const now = new Date();
    const sec = Math.floor(now.getTime() / 1000).toString();
    setEpochInput(sec);
    const pad = (n: number) => n.toString().padStart(2, '0');
    setDateInput(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
  };

  return (
    <div className="space-y-6">
      {/* Current Unix Epoch Live Banner */}
      <div className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#11141C] border border-[#EAE6DF] dark:border-[#202532] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-[#F5B301]" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Current Unix Timestamp (Epoch)</span>
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-[#111827] dark:text-[#F3F4F6]">
              {currentEpoch}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => copyVal(currentEpoch.toString(), 'live')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827] hover:opacity-90 flex items-center gap-1.5"
          >
            {copiedKey === 'live' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'live' ? 'Copied' : 'Copy Current'}</span>
          </button>
          <button
            onClick={setNow}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-slate-700 dark:text-slate-300 hover:border-[#F5B301]"
          >
            Reset to Now
          </button>
        </div>
      </div>

      {/* Two-Way Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Epoch input */}
        <div className="space-y-2 p-5 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23]">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
            Unix Timestamp (Seconds or Milliseconds)
          </label>
          <input
            type="text"
            value={epochInput}
            onChange={(e) => {
              setEpochInput(e.target.value);
              const num = Number(e.target.value);
              if (!isNaN(num) && e.target.value) {
                const ms = e.target.value.length > 10 ? num : num * 1000;
                const d = new Date(ms);
                if (!isNaN(d.getTime())) {
                  const pad = (n: number) => n.toString().padStart(2, '0');
                  setDateInput(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
                }
              }
            }}
            placeholder="e.g. 1776518400"
            className="w-full p-3 rounded-xl border border-[#EAE6DF] dark:border-[#262B38] bg-[#FAF8F5] dark:bg-[#11141C] font-mono text-sm sm:text-base text-[#111827] dark:text-[#F3F4F6] focus:outline-none focus:border-[#F5B301]"
          />
          <span className="text-[11px] text-slate-400 block">Autodetects 10-digit seconds and 13-digit milliseconds.</span>
        </div>

        {/* Human Date input */}
        <div className="space-y-2 p-5 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23]">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
            Local Date &amp; Time (YYYY-MM-DDTHH:mm:ss)
          </label>
          <input
            type="datetime-local"
            step="1"
            value={dateInput}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full p-3 rounded-xl border border-[#EAE6DF] dark:border-[#262B38] bg-[#FAF8F5] dark:bg-[#11141C] font-mono text-sm sm:text-base text-[#111827] dark:text-[#F3F4F6] focus:outline-none focus:border-[#F5B301]"
          />
          <span className="text-[11px] text-slate-400 block">Adjust time to convert into epoch seconds live.</span>
        </div>
      </div>

      {/* Formatted Output Breakdown */}
      {parsedEpochDate && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Standard Output Formats
          </h3>
          <div className="divide-y divide-[#F2EFE9] dark:divide-[#202532] border border-[#EAE6DF] dark:border-[#262B38] rounded-2xl bg-white dark:bg-[#171A23] overflow-hidden">
            {[
              { label: 'ISO 8601 (UTC)', val: parsedEpochDate.toISOString(), key: 'iso' },
              { label: 'UTC String (GMT)', val: parsedEpochDate.toUTCString(), key: 'utc' },
              { label: 'Local Timezone', val: parsedEpochDate.toString(), key: 'local' },
              { label: 'Unix Timestamp (Seconds)', val: Math.floor(parsedEpochDate.getTime() / 1000).toString(), key: 'sec' },
              { label: 'Unix Timestamp (Milliseconds)', val: parsedEpochDate.getTime().toString(), key: 'ms' },
            ].map((row) => (
              <div key={row.key} className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-500 sm:w-1/3">{row.label}</span>
                <span className="font-mono text-xs sm:text-sm text-[#111827] dark:text-white select-all break-all sm:w-1/2">
                  {row.val}
                </span>
                <button
                  onClick={() => copyVal(row.val, row.key)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white self-start sm:self-auto shrink-0 flex items-center gap-1"
                >
                  {copiedKey === row.key ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === row.key ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
