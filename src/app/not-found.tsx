import Link from 'next/link';
import ToolCard from '@/components/ToolCard';
import { tools } from '@/tools.config';
import { Compass, Home, Search, ArrowRight } from 'lucide-react';

export default function NotFound() {
  const suggestedSlugs = [
    'compress-image-to-100kb',
    'image-resizer',
    'jpg-to-pdf',
    'compress-pdf',
    'password-generator',
    'percentage-calculator'
  ];

  const suggestedTools = suggestedSlugs
    .map(slug => tools.find(t => t.slug === slug))
    .filter((t): t is typeof tools[0] => t !== undefined);

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl text-center">
      <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 shadow-sm">
        <Compass className="w-10 h-10 animate-spin-slow" />
      </div>

      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
        404 · Page Not Found
      </span>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mt-2 mb-4">
        We Couldn&apos;t Find That Page
      </h1>
      <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-8">
        The tool or page you are looking for might have been moved or renamed. Try searching or check out these popular free tools below.
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all text-sm"
        >
          <Home className="w-4 h-4" />
          Back to Homepage
        </Link>
        <Link
          href="/#tools"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm shadow-xs"
        >
          <Search className="w-4 h-4" />
          Browse All 22 Tools
        </Link>
      </div>

      {/* Suggested tools grid */}
      <div className="text-left">
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Suggested Free Tools
          </h2>
          <Link href="/#categories" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            View All Categories &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestedTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </div>
    </div>
  );
}
