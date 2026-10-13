'use client';
import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function KeyboardTester() {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [lastKey, setLastKey] = useState<{ key: string; code: string; which: number } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      setPressedKeys((prev) => new Set(prev).add(e.code));
      setLastKey({ key: e.key, code: e.code, which: e.which });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const resetTester = () => {
    setPressedKeys(new Set());
    setLastKey(null);
  };

  // Keyboard Layout rows
  const keyboardRows = [
    // Function Row
    [
      { code: 'Escape', label: 'Esc', w: 'w-10' },
      { code: 'F1', label: 'F1', w: 'w-9' },
      { code: 'F2', label: 'F2', w: 'w-9' },
      { code: 'F3', label: 'F3', w: 'w-9' },
      { code: 'F4', label: 'F4', w: 'w-9' },
      { code: 'F5', label: 'F5', w: 'w-9' },
      { code: 'F6', label: 'F6', w: 'w-9' },
      { code: 'F7', label: 'F7', w: 'w-9' },
      { code: 'F8', label: 'F8', w: 'w-9' },
      { code: 'F9', label: 'F9', w: 'w-9' },
      { code: 'F10', label: 'F10', w: 'w-9' },
      { code: 'F11', label: 'F11', w: 'w-9' },
      { code: 'F12', label: 'F12', w: 'w-9' },
    ],
    // Number Row
    [
      { code: 'Backquote', label: '~', w: 'w-9' },
      { code: 'Digit1', label: '1', w: 'w-9' },
      { code: 'Digit2', label: '2', w: 'w-9' },
      { code: 'Digit3', label: '3', w: 'w-9' },
      { code: 'Digit4', label: '4', w: 'w-9' },
      { code: 'Digit5', label: '5', w: 'w-9' },
      { code: 'Digit6', label: '6', w: 'w-9' },
      { code: 'Digit7', label: '7', w: 'w-9' },
      { code: 'Digit8', label: '8', w: 'w-9' },
      { code: 'Digit9', label: '9', w: 'w-9' },
      { code: 'Digit0', label: '0', w: 'w-9' },
      { code: 'Minus', label: '-', w: 'w-9' },
      { code: 'Equal', label: '=', w: 'w-9' },
      { code: 'Backspace', label: 'Backspace', w: 'w-16' },
    ],
    // Tab / QWERTY
    [
      { code: 'Tab', label: 'Tab', w: 'w-14' },
      { code: 'KeyQ', label: 'Q', w: 'w-9' },
      { code: 'KeyW', label: 'W', w: 'w-9' },
      { code: 'KeyE', label: 'E', w: 'w-9' },
      { code: 'KeyR', label: 'R', w: 'w-9' },
      { code: 'KeyT', label: 'T', w: 'w-9' },
      { code: 'KeyY', label: 'Y', w: 'w-9' },
      { code: 'KeyU', label: 'U', w: 'w-9' },
      { code: 'KeyI', label: 'I', w: 'w-9' },
      { code: 'KeyO', label: 'O', w: 'w-9' },
      { code: 'KeyP', label: 'P', w: 'w-9' },
      { code: 'BracketLeft', label: '[', w: 'w-9' },
      { code: 'BracketRight', label: ']', w: 'w-9' },
      { code: 'Backslash', label: '\\', w: 'w-11' },
    ],
    // Caps / Home Row
    [
      { code: 'CapsLock', label: 'Caps', w: 'w-16' },
      { code: 'KeyA', label: 'A', w: 'w-9' },
      { code: 'KeyS', label: 'S', w: 'w-9' },
      { code: 'KeyD', label: 'D', w: 'w-9' },
      { code: 'KeyF', label: 'F', w: 'w-9' },
      { code: 'KeyG', label: 'G', w: 'w-9' },
      { code: 'KeyH', label: 'H', w: 'w-9' },
      { code: 'KeyJ', label: 'J', w: 'w-9' },
      { code: 'KeyK', label: 'K', w: 'w-9' },
      { code: 'KeyL', label: 'L', w: 'w-9' },
      { code: 'Semicolon', label: ';', w: 'w-9' },
      { code: 'Quote', label: "'", w: 'w-9' },
      { code: 'Enter', label: 'Enter', w: 'w-16' },
    ],
    // Shift / Bottom Row
    [
      { code: 'ShiftLeft', label: 'Shift', w: 'w-20' },
      { code: 'KeyZ', label: 'Z', w: 'w-9' },
      { code: 'KeyX', label: 'X', w: 'w-9' },
      { code: 'KeyC', label: 'C', w: 'w-9' },
      { code: 'KeyV', label: 'V', w: 'w-9' },
      { code: 'KeyB', label: 'B', w: 'w-9' },
      { code: 'KeyN', label: 'N', w: 'w-9' },
      { code: 'KeyM', label: 'M', w: 'w-9' },
      { code: 'Comma', label: ',', w: 'w-9' },
      { code: 'Period', label: '.', w: 'w-9' },
      { code: 'Slash', label: '/', w: 'w-9' },
      { code: 'ShiftRight', label: 'Shift', w: 'w-16' },
    ],
    // Space / Mods
    [
      { code: 'ControlLeft', label: 'Ctrl', w: 'w-12' },
      { code: 'MetaLeft', label: 'Win', w: 'w-10' },
      { code: 'AltLeft', label: 'Alt', w: 'w-10' },
      { code: 'Space', label: 'Spacebar', w: 'w-56' },
      { code: 'AltRight', label: 'Alt', w: 'w-10' },
      { code: 'MetaRight', label: 'Win', w: 'w-10' },
      { code: 'ControlRight', label: 'Ctrl', w: 'w-12' },
    ]
  ];

  return (
    <div className="space-y-6">
      {/* Live key metadata strip */}
      <div className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#11141C] border border-[#EAE6DF] dark:border-[#202532] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Last Pressed Key Information</span>
          {lastKey ? (
            <div className="flex flex-wrap items-center gap-3 mt-1 font-mono text-xs sm:text-sm">
              <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold">Key: &quot;{lastKey.key}&quot;</span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Code: {lastKey.code}</span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">which: {lastKey.which}</span>
            </div>
          ) : (
            <p className="text-xs text-slate-400 mt-1">Press any key on your physical keyboard to test responsiveness...</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500">
            {pressedKeys.size} keys tested
          </span>
          <button
            onClick={resetTester}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827] flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Matrix</span>
          </button>
        </div>
      </div>

      {/* Visual Keyboard SVG/HTML grid */}
      <div className="p-4 sm:p-6 rounded-3xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] shadow-sm overflow-x-auto">
        <div className="min-w-[650px] space-y-2 select-none">
          {keyboardRows.map((row, rIdx) => (
            <div key={rIdx} className="flex gap-1.5 justify-center">
              {row.map((k) => {
                const isTested = pressedKeys.has(k.code);
                return (
                  <div
                    key={k.code}
                    className={`h-10 sm:h-11 ${k.w} rounded-lg border text-[11px] font-bold flex items-center justify-center transition-all duration-150 ${
                      isTested
                        ? 'bg-[#F5B301] text-[#111827] border-[#D97706] shadow-xs'
                        : 'bg-[#FAF8F5] dark:bg-[#11141C] text-slate-700 dark:text-slate-300 border-[#EAE6DF] dark:border-[#2D3344] hover:border-slate-400'
                    }`}
                  >
                    {k.label}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span>Ghosting &amp; Key rollover test: Press multiple keys simultaneously (e.g. Shift + W + Space) to verify your keyboard hardware correctly registers simultaneous chords without ghosting.</span>
      </div>
    </div>
  );
}
