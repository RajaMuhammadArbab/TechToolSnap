'use client';
import { useState } from 'react';
import { Copy, Check, Trash2, ArrowRightLeft } from 'lucide-react';

export default function TextCaseConverter() {
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog.');
  const [copied, setCopied] = useState(false);

  const toSentenceCase = (str: string) => {
    return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  };

  const toTitleCase = (str: string) => {
    return str.toLowerCase().replace(/\b(\w)/g, (c) => c.toUpperCase());
  };

  const toCamelCase = (str: string) => {
    return str
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
      .replace(/^[A-Z]/, (c) => c.toLowerCase());
  };

  const toSnakeCase = (str: string) => {
    return str
      .trim()
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .toLowerCase();
  };

  const toKebabCase = (str: string) => {
    return str
      .trim()
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .toLowerCase();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6">
      {/* Transformation Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#11141C] border border-[#EAE6DF] dark:border-[#202532]">
        <button
          onClick={() => setText(text.toUpperCase())}
          className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-slate-800 dark:text-slate-200 hover:border-[#F5B301]"
        >
          UPPERCASE
        </button>
        <button
          onClick={() => setText(text.toLowerCase())}
          className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-slate-800 dark:text-slate-200 hover:border-[#F5B301]"
        >
          lowercase
        </button>
        <button
          onClick={() => setText(toTitleCase(text))}
          className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-slate-800 dark:text-slate-200 hover:border-[#F5B301]"
        >
          Title Case
        </button>
        <button
          onClick={() => setText(toSentenceCase(text))}
          className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-slate-800 dark:text-slate-200 hover:border-[#F5B301]"
        >
          Sentence case
        </button>
        <button
          onClick={() => setText(toCamelCase(text))}
          className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-slate-800 dark:text-slate-200 hover:border-[#F5B301]"
        >
          camelCase
        </button>
        <button
          onClick={() => setText(toSnakeCase(text))}
          className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-slate-800 dark:text-slate-200 hover:border-[#F5B301]"
        >
          snake_case
        </button>
        <button
          onClick={() => setText(toKebabCase(text))}
          className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-slate-800 dark:text-slate-200 hover:border-[#F5B301]"
        >
          kebab-case
        </button>
      </div>

      {/* Text Editor Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          <span>Editable Text</span>
          <div className="flex items-center gap-4">
            <span>{wordCount} words · {text.length} chars</span>
            <button
              onClick={handleCopy}
              className="text-[#D97706] dark:text-[#F5B301] hover:underline flex items-center gap-1 font-bold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={() => setText('')}
              className="text-slate-400 hover:text-red-500"
              title="Clear"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type text to convert case..."
          className="w-full h-80 p-5 rounded-3xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] text-sm sm:text-base leading-relaxed text-[#111827] dark:text-[#F3F4F6] focus:outline-none focus:border-[#F5B301] resize-none"
        />
      </div>
    </div>
  );
}
