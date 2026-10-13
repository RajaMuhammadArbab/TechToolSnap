'use client';
import { useState, useMemo } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

export default function LoremIpsumGenerator() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [startWithClassic, setStartWithClassic] = useState(true);
  const [wrapHtml, setWrapHtml] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateSentence = (): string => {
    const len = Math.floor(Math.random() * 8) + 8;
    const words: string[] = [];
    for (let i = 0; i < len; i++) {
      words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
    }
    const joined = words.join(' ');
    return joined.charAt(0).toUpperCase() + joined.slice(1) + '.';
  };

  const generateParagraph = (): string => {
    const sentenceCount = Math.floor(Math.random() * 3) + 4;
    const sentences: string[] = [];
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence());
    }
    return sentences.join(' ');
  };

  const output = useMemo(() => {
    let result = '';

    if (unit === 'paragraphs') {
      const paras: string[] = [];
      for (let i = 0; i < count; i++) {
        let p = generateParagraph();
        if (i === 0 && startWithClassic) {
          p = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + p;
        }
        paras.push(wrapHtml ? `<p>${p}</p>` : p);
      }
      result = paras.join('\n\n');
    } else if (unit === 'sentences') {
      const sents: string[] = [];
      for (let i = 0; i < count; i++) {
        let s = generateSentence();
        if (i === 0 && startWithClassic) {
          s = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
        }
        sents.push(s);
      }
      result = wrapHtml ? `<p>${sents.join(' ')}</p>` : sents.join(' ');
    } else {
      // Words
      const words: string[] = [];
      if (startWithClassic && count >= 8) {
        words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet,', 'consectetur', 'adipiscing', 'elit');
      }
      while (words.length < count) {
        words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
      }
      const raw = words.slice(0, count).join(' ');
      result = wrapHtml ? `<p>${raw}</p>` : raw;
    }

    return result;
  }, [count, unit, startWithClassic, wrapHtml]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Parameter Settings */}
      <div className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#11141C] border border-[#EAE6DF] dark:border-[#202532] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Generate:</span>
              <input
                type="number"
                min="1"
                max={unit === 'words' ? 500 : 20}
                value={count}
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-18 px-3 py-1.5 text-xs font-bold rounded-xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23]"
              />
            </div>

            <div className="flex gap-1 p-0.5 rounded-xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23]">
              <button
                onClick={() => { setUnit('paragraphs'); setCount(3); }}
                className={`px-3 py-1 text-xs font-bold rounded-lg ${unit === 'paragraphs' ? 'bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827]' : 'text-slate-500'}`}
              >
                Paragraphs
              </button>
              <button
                onClick={() => { setUnit('sentences'); setCount(5); }}
                className={`px-3 py-1 text-xs font-bold rounded-lg ${unit === 'sentences' ? 'bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827]' : 'text-slate-500'}`}
              >
                Sentences
              </button>
              <button
                onClick={() => { setUnit('words'); setCount(50); }}
                className={`px-3 py-1 text-xs font-bold rounded-lg ${unit === 'words' ? 'bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827]' : 'text-slate-500'}`}
              >
                Words
              </button>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827] flex items-center gap-1.5 hover:opacity-90"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[#EAE6DF] dark:border-[#262B38] text-xs font-semibold text-slate-700 dark:text-slate-300">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={startWithClassic}
              onChange={(e) => setStartWithClassic(e.target.checked)}
              className="rounded accent-[#F5B301]"
            />
            <span>Start with &quot;Lorem ipsum dolor sit amet...&quot;</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={wrapHtml}
              onChange={(e) => setWrapHtml(e.target.checked)}
              className="rounded accent-[#F5B301]"
            />
            <span>Wrap in HTML &lt;p&gt; tags</span>
          </label>
        </div>
      </div>

      {/* Output Display */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          <span>Placeholder Dummy Text</span>
          <span>{output.length} characters</span>
        </div>
        <textarea
          readOnly
          value={output}
          className="w-full h-80 p-5 rounded-3xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] text-sm leading-relaxed text-[#111827] dark:text-[#F3F4F6] focus:outline-none resize-none"
        />
      </div>
    </div>
  );
}
