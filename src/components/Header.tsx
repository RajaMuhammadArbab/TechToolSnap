'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sun, Moon, Menu, X, Search, ShieldCheck } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import CommandPalette from '@/components/CommandPalette';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Global keydown listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#FAF8F5]/85 dark:bg-[#0F1117]/85 border-b border-[#EAE6DF] dark:border-[#262B38] transition-colors">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4 max-w-7xl">
          {/* TechToolSnap logo — teal square with lightning-bolt mark */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-teal-600 dark:bg-teal-700 flex items-center justify-center group-hover:bg-teal-500 transition-colors shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                {/* Lightning bolt — tech/speed motif */}
                <path
                  d="M13 2L4.5 13.5H11.5L11 22L19.5 10.5H12.5L13 2Z"
                  fill="white"
                  stroke="white"
                  strokeWidth="0.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[#111827] dark:text-white">
              Tech<span className="text-teal-600 dark:text-teal-400">Tool</span>Snap
            </span>
          </Link>

          {/* Desktop Nav by Category */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <Link 
              href="/developer-tools" 
              className="px-3.5 py-1.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800/80 hover:text-slate-950 dark:hover:text-white transition-colors"
            >
              Developer Tools
            </Link>
            <Link 
              href="/image-tools" 
              className="px-3.5 py-1.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800/80 hover:text-slate-950 dark:hover:text-white transition-colors"
            >
              Image Tools
            </Link>
            <Link 
              href="/pdf-tools" 
              className="px-3.5 py-1.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800/80 hover:text-slate-950 dark:hover:text-white transition-colors"
            >
              PDF Tools
            </Link>
            <Link 
              href="/calculators" 
              className="px-3.5 py-1.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800/80 hover:text-slate-950 dark:hover:text-white transition-colors"
            >
              Calculators
            </Link>
            <Link 
              href="/text-tools" 
              className="px-3.5 py-1.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800/80 hover:text-slate-950 dark:hover:text-white transition-colors"
            >
              Text &amp; Security
            </Link>
            <Link 
              href="/blog" 
              className="px-3.5 py-1.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800/80 hover:text-slate-950 dark:hover:text-white transition-colors"
            >
              Guides
            </Link>
          </nav>

          {/* Right Controls: Search Ctrl+K, Dark Mode, Mobile Hamburger */}
          <div className="flex items-center gap-2">
            {/* Quick Search Button (Ctrl+K) */}
            <button
              onClick={() => setIsCommandOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-[#171A23] hover:border-[#F5B301] border border-[#EAE6DF] dark:border-[#262B38] shadow-2xs transition-all"
              aria-label="Search tools with keyboard shortcut"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline font-mono text-[10px] bg-[#FAF8F5] dark:bg-[#202532] text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded border border-[#EAE6DF] dark:border-[#2D3344]">
                Ctrl K
              </kbd>
            </button>

            {/* Dark Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-slate-700 dark:text-slate-200 hover:text-[#F5B301] dark:hover:text-[#F5B301] transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#F5B301]" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden p-2 rounded-xl bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-slate-700 dark:text-slate-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF8F5] dark:bg-[#0F1117] border-b border-[#EAE6DF] dark:border-[#262B38] py-4 px-5 shadow-lg space-y-3">
            <nav className="flex flex-col gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
              <Link 
                href="/developer-tools" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold"
              >
                Developer Tools
              </Link>
              <Link 
                href="/image-tools" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800"
              >
                Image Tools
              </Link>
              <Link 
                href="/pdf-tools" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800"
              >
                PDF Tools
              </Link>
              <Link 
                href="/calculators" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800"
              >
                Calculators
              </Link>
              <Link 
                href="/text-tools" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800"
              >
                Text &amp; Security Tools
              </Link>
              <Link 
                href="/blog" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 text-[#F5B301]"
              >
                Guides &amp; Articles
              </Link>
            </nav>
            <div className="pt-2 border-t border-[#EAE6DF] dark:border-[#262B38] flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Client-side · Zero file uploads</span>
            </div>
          </div>
        )}
      </header>

      {/* Ctrl+K Search Palette */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </>
  );
}
