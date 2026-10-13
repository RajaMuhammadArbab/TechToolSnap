'use client';
import { useState, useMemo } from 'react';
import { Copy, Check, Trash2, AlignLeft } from 'lucide-react';

export default function CharacterCounter() {
  const [text, setText] = useState(`TechToolSnap delivers private, client-side online tools for image compression, PDF documents, developer workflows, and text manipulation.`);
  const [copied, setCopied] = useState(false);

  // Statistics calculation
  const stats = useMemo(() => {
    const totalChars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim() ? (text.match(/[.!?]+(?:\s|$)/g) || []).length || (text.trim().length > 0 ? 1 : 0) : 0;
    const paragraphs = text.trim() ? text.split(/\n+/).filter((p) => p.trim().length > 0).length : 0;
    const readingTimeMinutes = Math.ceil(words / 200);
    const speakingTimeMinutes = Math.ceil(words / 130);

    return {
      totalChars,
      charsNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTimeMinutes,
      speakingTimeMinutes,
    };
  }, [text]);

  const socialLimits = [
    { name: 'Twitter / X', max: 280, current: stats.totalChars },
    { name: 'Google SEO Title', max: 60, current: stats.totalChars },
    { name: 'Google Meta Description', max: 160, current: stats.totalChars },
    { name: 'LinkedIn Post', max: 3000, current: stats.totalChars },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Characters</span>
          <p className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-white mt-0.5">{stats.totalChars}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Without Spaces</span>
          <p className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-white mt-0.5">{stats.charsNoSpaces}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Words</span>
          <p className="text-xl sm:text-2xl font-extrabold text-amber-600 dark:text-[#F5B301] mt-0.5">{stats.words}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sentences</span>
          <p className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-white mt-0.5">{stats.sentences}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-center col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Paragraphs</span>
          <p className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-white mt-0.5">{stats.paragraphs}</p>
        </div>
      </div>

      {/* Editor Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          <span>Type or Paste Content</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="text-[#D97706] dark:text-[#F5B301] hover:underline flex items-center gap-1 font-bold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
            <button
              onClick={() => setText('')}
              className="text-slate-400 hover:text-red-500"
              title="Clear text"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your article draft..."
          className="w-full h-72 p-5 rounded-3xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] text-sm sm:text-base leading-relaxed text-[#111827] dark:text-[#F3F4F6] focus:outline-none focus:border-[#F5B301] resize-none"
        />
      </div>

      {/* Social Media & SEO Progress Limit Trackers */}
      <div className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#11141C] border border-[#EAE6DF] dark:border-[#262B38] space-y-3">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
          Platform Character Limits
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {socialLimits.map((limit) => {
            const pct = Math.min(100, Math.round((limit.current / limit.max) * 100));
            const isOver = limit.current > limit.max;
            return (
              <div key={limit.name} className="space-y-1.5 p-3 rounded-xl bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38]">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">{limit.name}</span>
                  <span className={isOver ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                    {limit.current} / {limit.max}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isOver ? 'bg-rose-500' : pct > 90 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
