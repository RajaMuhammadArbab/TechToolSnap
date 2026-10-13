import Link from 'next/link';
import { 
  Minimize2, 
  Maximize2, 
  FileImage, 
  Calendar, 
  Type, 
  FilePlus2, 
  FileMinus2, 
  RefreshCw, 
  Repeat, 
  QrCode, 
  Percent, 
  GraduationCap, 
  Camera, 
  CreditCard, 
  Coins, 
  Sparkles,
  ArrowDownToLine,
  KeyRound,
  FileDown,
  ArrowUpRight,
  FileJson,
  Binary,
  Link2,
  Fingerprint,
  ShieldCheck,
  Regex,
  Clock,
  Palette,
  Hash,
  FileCode2,
  Table,
  Keyboard,
  Barcode,
  CaseSensitive,
  ListFilter,
  FileDiff,
  ArrowDownAZ,
  SearchCheck,
  Link as LinkIcon,
  FileText,
  RotateCcw,
  AlignLeft
} from 'lucide-react';
import { ToolConfig } from '@/tools.config';
import React from 'react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Minimize2,
  Maximize2,
  FileImage,
  Calendar,
  Type,
  FilePlus2,
  FileMinus2,
  RefreshCw,
  Repeat,
  QrCode,
  Percent,
  GraduationCap,
  Camera,
  CreditCard,
  Coins,
  ArrowDownToLine,
  Sparkles,
  KeyRound,
  FileDown,
  FileJson,
  Binary,
  Link2,
  Fingerprint,
  ShieldCheck,
  Regex,
  Clock,
  Palette,
  Hash,
  FileCode2,
  Table,
  Keyboard,
  Barcode,
  CaseSensitive,
  ListFilter,
  FileDiff,
  ArrowDownAZ,
  SearchCheck,
  Link: LinkIcon,
  FileText,
  RotateCcw,
  AlignLeft
};

// Pastel tints per category specification:
export function getCategoryStyle(category: string, slug?: string) {
  const isPakistan = slug === 'cnic-photo-resizer' || slug === 'passport-size-photo-maker' || slug === 'zakat-calculator';
  if (isPakistan) {
    return {
      tileBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40',
      badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900/50',
      borderHover: 'group-hover:border-amber-400 dark:group-hover:border-amber-500',
    };
  }

  switch (category) {
    case 'Image':
      return {
        tileBg: 'bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300 border-violet-200/60 dark:border-violet-800/40',
        badge: 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border-violet-200 dark:border-violet-900/50',
        borderHover: 'group-hover:border-violet-400 dark:group-hover:border-violet-500',
      };
    case 'PDF':
      return {
        tileBg: 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/40',
        badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900/50',
        borderHover: 'group-hover:border-rose-400 dark:group-hover:border-rose-500',
      };
    case 'Calculators':
      return {
        tileBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/40',
        badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50',
        borderHover: 'group-hover:border-emerald-400 dark:group-hover:border-emerald-500',
      };
    case 'Text':
      return {
        tileBg: 'bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300 border-sky-200/60 dark:border-sky-800/40',
        badge: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-900/50',
        borderHover: 'group-hover:border-sky-400 dark:group-hover:border-sky-500',
      };
    case 'Developer Tools':
      return {
        tileBg: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/40',
        badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/50',
        borderHover: 'group-hover:border-indigo-400 dark:group-hover:border-indigo-500',
      };
    default:
      return {
        tileBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40',
        badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900/50',
        borderHover: 'group-hover:border-amber-400 dark:group-hover:border-amber-500',
      };
  }
}

// Shorten tool title for compact category grids if shortTitle is absent
export function getShortToolTitle(title: string): string {
  return title
    .replace(/\s+(Free\s+Online|Online\s+Tool|Online\s+Free|Free\s+Converter|Online|Tool)\b/gi, '')
    .replace(/\s*\(.*?\)/g, '')
    .trim();
}

interface ToolCardProps {
  tool: ToolConfig;
  compact?: boolean;
}

export default function ToolCard({ tool, compact = false }: ToolCardProps) {
  const IconComponent = iconMap[tool.icon] || Sparkles;
  const style = getCategoryStyle(tool.category, tool.slug);
  const isPakistan = tool.slug === 'cnic-photo-resizer' || tool.slug === 'passport-size-photo-maker' || tool.slug === 'zakat-calculator';

  // Use explicit shortTitle if available, otherwise getShortToolTitle fallback for compact cards
  const displayedTitle = tool.shortTitle || (compact ? getShortToolTitle(tool.title) : tool.title);

  if (compact) {
    return (
      <Link href={`/${tool.slug}`} className="block group h-full" title={tool.title}>
        <div className={`bg-white dark:bg-[#171A23] rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] p-4 sm:p-4.5 shadow-2xs hover:shadow-md hover:-translate-y-1 ${style.borderHover} transition-all duration-150 h-full flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${style.tileBg}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#F5B301] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
            </div>

            {/* Title allowed to wrap up to 2 lines with consistent min-height */}
            <h3 className="font-bold text-sm sm:text-base text-[#111827] dark:text-[#F3F4F6] group-hover:text-[#D97706] dark:group-hover:text-[#F5B301] transition-colors leading-snug line-clamp-2 min-h-[2.5rem]">
              {displayedTitle}
            </h3>

            {/* Description allowed up to 2 lines with slightly smaller text */}
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
              {tool.description}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/${tool.slug}`} className="block group h-full" title={tool.title}>
      <div className={`bg-white dark:bg-[#171A23] rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] p-5 sm:p-6 shadow-2xs hover:shadow-md hover:-translate-y-1 ${style.borderHover} transition-all duration-200 h-full flex flex-col justify-between`}>
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${style.tileBg}`}>
              <IconComponent className="w-6 h-6" />
            </div>
            {isPakistan ? (
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                Pakistan
              </span>
            ) : (
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${style.badge}`}>
                {tool.category}
              </span>
            )}
          </div>

          {/* Title allowed to wrap up to 2 lines */}
          <h3 className="font-bold text-base sm:text-lg text-[#111827] dark:text-[#F3F4F6] group-hover:text-[#D97706] dark:group-hover:text-[#F5B301] transition-colors leading-snug line-clamp-2 min-h-[2.75rem]">
            {displayedTitle}
          </h3>

          {/* Description allowed up to 2 lines */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {tool.description}
          </p>
        </div>

        <div className="mt-5 pt-3 border-t border-[#F2EFE9] dark:border-[#202532] flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span className="text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
            Free · In-Browser
          </span>
          <span className="inline-flex items-center gap-1 text-[#111827] dark:text-[#F3F4F6] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
            <span>Open</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#F5B301]" />
          </span>
        </div>
      </div>
    </Link>
  );
}
