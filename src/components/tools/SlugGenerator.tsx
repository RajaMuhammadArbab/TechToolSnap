'use client';
import { useState, useMemo } from 'react';
import { Copy, Check, Link as LinkIcon, RefreshCw } from 'lucide-react';

export default function SlugGenerator() {
  const [title, setTitle] = useState('How to Reduce Image Size to 100KB Without Losing Quality!');
  const [separator, setSeparator] = useState<'-' | '_' | '.'>('-');
  const [stripStopWords, setStripStopWords] = useState(false);
  const [lowercase, setLowercase] = useState(true);
  const [copied, setCopied] = useState(false);

  const STOP_WORDS = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'if', 'in',
    'into', 'is', 'it', 'no', 'not', 'of', 'on', 'or', 'such', 'that', 'the',
    'their', 'then', 'there', 'these', 'they', 'this', 'to', 'was', 'will', 'with'
  ]);

  // Transliterate and sanitize string into SEO slug
  const slug = useMemo(() => {
    if (!title.trim()) return '';

    // Normalize accents (é -> e, ü -> u)
    let str = title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    if (lowercase) {
      str = str.toLowerCase();
    }

    // Split into words
    let words = str
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .trim()
      .split(/\s+/);

    if (stripStopWords) {
      words = words.filter((w) => !STOP_WORDS.has(w.toLowerCase()));
    }

    return words.join(separator);
  }, [title, separator, stripStopWords, lowercase]);

  const handleCopy = () => {
    if (!slug) return;
    navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Input Field */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
          Article Title, Product Name or Headline
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Type or paste title here..."
          className="w-full p-4 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] text-sm sm:text-base font-bold text-[#111827] dark:text-[#F3F4F6] focus:outline-none focus:border-[#F5B301]"
        />
      </div>

      {/* Generated Slug Result Box */}
      <div className="p-6 rounded-3xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
            SEO URL Slug Result
          </span>
          {slug && (
            <button
              onClick={handleCopy}
              className="text-xs font-bold text-[#B45309] dark:text-[#F5B301] hover:underline flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Slug'}</span>
            </button>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] font-mono text-sm sm:text-base font-bold text-[#111827] dark:text-[#F3F4F6] break-all select-all">
          {slug || 'your-slug-will-appear-here'}
        </div>

        <p className="text-xs text-slate-500 font-mono">
          Preview: https://yourdomain.com/blog/<span className="text-amber-600 dark:text-[#F5B301] font-bold">{slug || '...'}</span>
        </p>
      </div>

      {/* Options Bar */}
      <div className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#11141C] border border-[#EAE6DF] dark:border-[#202532] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Separator:</span>
          <div className="flex gap-1 p-0.5 rounded-xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23]">
            <button
              onClick={() => setSeparator('-')}
              className={`px-3 py-1 text-xs font-bold rounded-lg ${separator === '-' ? 'bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827]' : 'text-slate-500'}`}
            >
              Hyphen (-)
            </button>
            <button
              onClick={() => setSeparator('_')}
              className={`px-3 py-1 text-xs font-bold rounded-lg ${separator === '_' ? 'bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827]' : 'text-slate-500'}`}
            >
              Underscore (_)
            </button>
            <button
              onClick={() => setSeparator('.')}
              className={`px-3 py-1 text-xs font-bold rounded-lg ${separator === '.' ? 'bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827]' : 'text-slate-500'}`}
            >
              Dot (.)
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={stripStopWords}
              onChange={(e) => setStripStopWords(e.target.checked)}
              className="rounded accent-[#F5B301]"
            />
            <span>Filter Stop Words (a, the, in, to)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={lowercase}
              onChange={(e) => setLowercase(e.target.checked)}
              className="rounded accent-[#F5B301]"
            />
            <span>Force Lowercase</span>
          </label>
        </div>
      </div>
    </div>
  );
}
