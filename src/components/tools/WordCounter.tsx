'use client';
import { useState, useEffect } from 'react';

export default function WordCounter() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    words: 0,
    chars: 0,
    charsNoSpaces: 0,
    paragraphs: 0
  });

  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).length : 0;
    
    setStats({ words, chars, charsNoSpaces, paragraphs });
  }, [text]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-sm">
          <div className="text-3xl font-bold text-indigo-500 mb-1">{stats.words}</div>
          <div className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wide">Words</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-sm">
          <div className="text-3xl font-bold text-indigo-500 mb-1">{stats.chars}</div>
          <div className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wide">Characters</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-sm">
          <div className="text-3xl font-bold text-indigo-500 mb-1">{stats.charsNoSpaces}</div>
          <div className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wide">Without Spaces</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-sm">
          <div className="text-3xl font-bold text-indigo-500 mb-1">{stats.paragraphs}</div>
          <div className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wide">Paragraphs</div>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here to count words, characters, and paragraphs..."
          className="w-full min-h-[300px] p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-y transition-all shadow-sm text-lg leading-relaxed"
        />
        {text && (
          <button
            onClick={() => setText('')}
            className="absolute top-4 right-4 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            Clear Text
          </button>
        )}
      </div>
    </div>
  );
}
