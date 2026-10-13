'use client';
import { useState, useMemo } from 'react';
import { Check, AlertCircle, Sparkles } from 'lucide-react';

export default function RegexTester() {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState({ g: true, i: true, m: false, s: false });
  const [testString, setTestString] = useState(
    'Contact our digital team at support@techtoolsnap.com or security-audit@company.org. For billing enquiries reach out to finance@enterprise.co.uk.'
  );

  const flagString = useMemo(() => {
    return Object.entries(flags)
      .filter(([_, val]) => val)
      .map(([k]) => k)
      .join('');
  }, [flags]);

  const { matches, error } = useMemo(() => {
    if (!pattern) return { matches: [], error: null };
    try {
      const reg = new RegExp(pattern, flagString);
      const found: { match: string; index: number; groups?: Record<string, string> }[] = [];
      
      if (flags.g) {
        let m: RegExpExecArray | null;
        let guard = 0;
        while ((m = reg.exec(testString)) !== null && guard < 1000) {
          guard++;
          found.push({
            match: m[0],
            index: m.index,
            groups: m.groups,
          });
          if (m.index === reg.lastIndex) {
            reg.lastIndex++;
          }
        }
      } else {
        const m = reg.exec(testString);
        if (m) {
          found.push({
            match: m[0],
            index: m.index,
            groups: m.groups,
          });
        }
      }
      return { matches: found, error: null };
    } catch (e: any) {
      return { matches: [], error: e.message };
    }
  }, [pattern, flagString, testString]);

  // Highlight matches in the test string
  const highlightedHtml = useMemo(() => {
    if (!pattern || error || matches.length === 0) return testString;
    try {
      const reg = new RegExp(pattern, flagString);
      return testString.replace(reg, (m) => `<mark class="bg-[#F5B301]/40 text-[#111827] dark:text-white px-1 py-0.5 rounded font-semibold">${m}</mark>`);
    } catch {
      return testString;
    }
  }, [pattern, flagString, testString, error, matches]);

  const loadPreset = (presetPattern: string, sample: string) => {
    setPattern(presetPattern);
    setTestString(sample);
  };

  return (
    <div className="space-y-6">
      {/* Pattern Input and Flags */}
      <div className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#11141C] border border-[#EAE6DF] dark:border-[#202532] space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
            Regular Expression
          </label>
          <div className="flex items-center rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] px-3 py-1 font-mono text-sm focus-within:border-[#F5B301]">
            <span className="text-slate-400 text-lg mr-1">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="e.g. \b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b"
              className="w-full py-2 bg-transparent focus:outline-none text-[#111827] dark:text-[#F3F4F6]"
            />
            <span className="text-slate-400 text-lg mx-1">/</span>
            <span className="text-amber-600 dark:text-[#F5B301] font-bold text-xs">{flagString}</span>
          </div>
        </div>

        {/* Flags & Presets */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#EAE6DF] dark:border-[#202532]">
          <div className="flex items-center gap-4 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="text-slate-400 uppercase text-[10px]">Flags:</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={flags.g}
                onChange={(e) => setFlags({ ...flags, g: e.target.checked })}
                className="rounded accent-[#F5B301]"
              />
              <span>g (Global)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={flags.i}
                onChange={(e) => setFlags({ ...flags, i: e.target.checked })}
                className="rounded accent-[#F5B301]"
              />
              <span>i (Case Insensitive)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={flags.m}
                onChange={(e) => setFlags({ ...flags, m: e.target.checked })}
                className="rounded accent-[#F5B301]"
              />
              <span>m (Multiline)</span>
            </label>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 uppercase text-[10px]">Presets:</span>
            <button
              onClick={() => loadPreset('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', 'Email: info@techtoolsnap.com and test@domain.org')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] hover:border-[#F5B301]"
            >
              Email
            </button>
            <button
              onClick={() => loadPreset('https?:\\/\\/[\\w\\.-]+\\.[a-zA-Z]{2,}(\\/\\S*)?', 'Visit https://techtoolsnap.com or http://example.org/page?id=1')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] hover:border-[#F5B301]"
            >
              URL
            </button>
            <button
              onClick={() => loadPreset('\\b\\d{4,5}-\\d{7}-\\d\\b', 'Pakistani CNIC numbers: 42101-1234567-1 and 35202-7654321-9')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] hover:border-[#F5B301]"
            >
              CNIC
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 text-xs sm:text-sm font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Regex Error: {error}</span>
        </div>
      )}

      {/* Test String and Match View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Test string editor */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
            Test String (Editable)
          </label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Type or paste text to test against your regular expression..."
            className="w-full h-64 p-4 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] font-mono text-xs sm:text-sm text-[#111827] dark:text-[#F3F4F6] focus:outline-none focus:border-[#F5B301] resize-none"
            spellCheck={false}
          />
        </div>

        {/* Live Highlighted Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            <span>Highlighted Matches</span>
            <span className="text-emerald-600 dark:text-emerald-400">{matches.length} {matches.length === 1 ? 'match' : 'matches'} found</span>
          </div>
          <div
            className="w-full h-64 p-4 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-[#FAF8F5]/80 dark:bg-[#11141C] font-mono text-xs sm:text-sm text-[#111827] dark:text-[#F3F4F6] overflow-auto whitespace-pre-wrap leading-relaxed"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </div>
      </div>

      {/* Match Table */}
      {matches.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Match Index Breakdown
          </h4>
          <div className="divide-y divide-[#F2EFE9] dark:divide-[#202532] border border-[#EAE6DF] dark:border-[#262B38] rounded-2xl bg-white dark:bg-[#171A23] max-h-48 overflow-y-auto">
            {matches.map((m, idx) => (
              <div key={idx} className="p-3 text-xs flex items-center justify-between font-mono">
                <span className="text-slate-400 font-bold">Match #{idx + 1} (Index {m.index})</span>
                <span className="font-semibold text-[#111827] dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{m.match}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
