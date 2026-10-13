'use client';
import { useState, useId } from 'react';
import Link from 'next/link';
import { Search, ShieldCheck, Zap, LockKeyhole, ArrowRight, Sparkles } from 'lucide-react';
import { tools } from '@/tools.config';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputId = useId();

  const filteredTools = searchQuery.trim()
    ? tools.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 8)
    : [];

  const popularChips = [
    { label: 'Compress to 100KB', slug: 'compress-image-to-100kb' },
    { label: 'Merge PDF', slug: 'pdf-merge' },
    { label: 'CNIC Photo Resizer', slug: 'cnic-photo-resizer' },
    { label: 'Passport Photo Maker', slug: 'passport-size-photo-maker' },
    { label: 'Zakat Calculator', slug: 'zakat-calculator' },
    { label: 'Password Generator', slug: 'password-generator' },
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-20 border-b border-[#EAE6DF] dark:border-[#262B38] bg-gradient-to-b from-[#FAF8F5] via-[#FAF8F5] to-[#F5F2EB] dark:from-[#0F1117] dark:via-[#0F1117] dark:to-[#131722]">
      {/* Subtle geometric ambient grid decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(#E2DDD3_1px,transparent_1px)] dark:bg-[radial-gradient(#1E2330_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative container mx-auto px-4 max-w-5xl text-center">
        {/* Subtle Category Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-xs font-semibold text-slate-700 dark:text-slate-300 mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#F5B301]" />
          <span>22 Free Privacy-First Utilities · No Cloud Uploads</span>
        </div>

        {/* Confident Headings */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#111827] dark:text-[#F3F4F6] leading-[1.15] mb-5">
          Fast, Free Online Tools <br className="hidden sm:inline" />
          <span className="relative inline-block">
            <span className="relative z-10">That Protect Your Privacy</span>
            <span className="absolute bottom-1 left-0 right-0 h-3 bg-[#F5B301]/30 dark:bg-[#F5B301]/20 -z-0 rounded-xs" />
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Compress photos, merge contracts, convert images, calculate zakat, and generate secure keys — processed entirely within your browser.
        </p>

        {/* Big Search Bar (Ctrl+K) */}
        <div className="relative max-w-2xl mx-auto mb-6">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              id={searchInputId}
              type="text"
              placeholder="Search by tool name or action (e.g. compress 100kb, cnic, merge pdf)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-28 py-4 sm:py-4.5 rounded-2xl border border-[#DCD6CA] dark:border-[#2D3344] bg-white dark:bg-[#171A23] text-[#111827] dark:text-[#F3F4F6] text-sm sm:text-base shadow-sm focus:outline-none focus:border-[#F5B301] focus:ring-2 focus:ring-[#F5B301]/30 transition-all placeholder:text-slate-400"
              aria-label="Search all tools"
            />
            <div className="absolute right-3 flex items-center gap-1.5">
              <kbd className="hidden sm:inline-flex items-center text-[11px] font-mono font-semibold bg-[#FAF8F5] dark:bg-[#202532] text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg border border-[#EAE6DF] dark:border-[#2D3344] shadow-2xs">
                Ctrl K
              </kbd>
            </div>
          </div>

          {/* Search Dropdown Results */}
          {filteredTools.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#171A23] rounded-2xl shadow-xl border border-[#EAE6DF] dark:border-[#262B38] overflow-hidden z-50 text-left divide-y divide-[#F2EFE9] dark:divide-[#202532]">
              {filteredTools.map(tool => (
                <Link
                  key={tool.slug}
                  href={`/${tool.slug}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-[#FAF8F5] dark:hover:bg-[#1C202C] transition-colors group"
                >
                  <div className="min-w-0 pr-4">
                    <div className="font-bold text-sm text-[#111827] dark:text-[#F3F4F6] group-hover:text-[#D97706] dark:group-hover:text-[#F5B301] transition-colors truncate">
                      {tool.title}
                    </div>
                    <div className="text-xs text-slate-500 truncate mt-0.5">
                      {tool.description}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-[#111827] dark:group-hover:text-white shrink-0 flex items-center gap-1">
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Popular Tool Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
            Trending:
          </span>
          {popularChips.map(chip => (
            <Link
              key={chip.slug}
              href={`/${chip.slug}`}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white dark:bg-[#171A23] text-slate-700 dark:text-slate-300 border border-[#EAE6DF] dark:border-[#262B38] hover:border-[#F5B301] hover:text-[#111827] dark:hover:text-white shadow-2xs transition-all"
            >
              {chip.label}
            </Link>
          ))}
        </div>

        {/* 3 Trust Badges (Free, No upload, No signup) - Strictly NO EMOJIS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto pt-4">
          <div className="flex items-center justify-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-[#F5B301]" />
            </div>
            <div className="text-left">
              <div className="font-bold text-xs text-[#111827] dark:text-[#F3F4F6]">100% Free Forever</div>
              <div className="text-[11px] text-slate-500">Zero subscriptions or hidden paywalls</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-left">
              <div className="font-bold text-xs text-[#111827] dark:text-[#F3F4F6]">Zero Cloud Uploads</div>
              <div className="text-[11px] text-slate-500">Your files never leave your computer</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 flex items-center justify-center shrink-0">
              <LockKeyhole className="w-5 h-5 text-sky-600" />
            </div>
            <div className="text-left">
              <div className="font-bold text-xs text-[#111827] dark:text-[#F3F4F6]">No Sign-up Required</div>
              <div className="text-[11px] text-slate-500">Instant access without entering emails</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
