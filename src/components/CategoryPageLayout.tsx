'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import ToolCard from '@/components/ToolCard';
import AdSlot from '@/components/AdSlot';
import { ToolConfig } from '@/tools.config';
import { Search, ChevronRight, HelpCircle, Layers, ArrowRight } from 'lucide-react';

export interface CategoryPageProps {
  categoryName: string;
  categorySlug: string;
  title: string;
  shortIntro: string;
  aboutParagraphs: string[];
  tools: ToolConfig[];
  collectionSchema: Record<string, any>;
  breadcrumbSchema: Record<string, any>;
  faqs?: { question: string; answer: string }[];
  relatedCategories?: { name: string; href: string }[];
}

export default function CategoryPageLayout({
  categoryName,
  categorySlug,
  title,
  shortIntro,
  aboutParagraphs,
  tools,
  collectionSchema,
  breadcrumbSchema,
  faqs = [],
  relatedCategories = []
}: CategoryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Client-side quick filter for the tool grid
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return tools;
    const q = searchQuery.toLowerCase();
    return tools.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [tools, searchQuery]);

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* 1. Single-line breadcrumb (small) */}
      <nav aria-label="Breadcrumb" className="mb-3">
        <ol className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400">
          <li>
            <Link href="/" className="hover:text-[#D97706] dark:hover:text-[#F5B301] transition-colors">
              Home
            </Link>
          </li>
          <li><ChevronRight className="w-3 h-3 text-slate-400" /></li>
          <li className="text-[#111827] dark:text-[#F3F4F6] font-semibold">
            {categoryName}
          </li>
        </ol>
      </nav>

      {/* 2. H1 + ONE intro line + small inline trust badges */}
      <header className="mb-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111827] dark:text-[#F3F4F6] tracking-tight mb-1.5">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-snug">
          {shortIntro}
        </p>

        {/* Small inline trust row (tiny text, no bulky boxes) */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <span className="text-emerald-700 dark:text-emerald-400">100% Free</span>
          <span>·</span>
          <span>Zero Server Uploads</span>
          <span>·</span>
          <span>No Sign-up Required</span>
        </div>
      </header>

      {/* 3. Slim row: tool count on left, small search/filter on right */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#EAE6DF] dark:border-[#262B38]">
        <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          <span>{filteredTools.length} {filteredTools.length === 1 ? 'Tool' : 'Tools'}</span>
          {searchQuery && <span className="text-slate-400 normal-case font-normal ml-1.5">(Filtered)</span>}
        </div>

        <div className="relative w-48 sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Filter ${categoryName.toLowerCase()}...`}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] text-[#111827] dark:text-[#F3F4F6] placeholder:text-slate-400 focus:outline-none focus:border-[#F5B301]"
          />
        </div>
      </div>

      {/* 4. THE TOOL GRID IMMEDIATELY (No ad slot above it, 4 cols desktop, 2 cols tablet, 1-2 mobile) */}
      <section aria-label={`${categoryName} tools`} className="mb-10">
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} compact={true} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl border border-dashed border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23]">
            <p className="text-xs sm:text-sm text-slate-500">No tools matched &quot;{searchQuery}&quot;.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-xs font-bold text-[#D97706] dark:text-[#F5B301] hover:underline"
            >
              Clear filter
            </button>
          </div>
        )}
      </section>

      {/* 5. Ad slot BELOW the grid (reserved height, invisible in production) */}
      <AdSlot id="category-mid-ad" className="mb-10" />

      {/* 6. "About these tools" section BELOW grid, collapsed via <details>/<summary> for instant full crawler indexing */}
      <section className="mb-8">
        <details className="group rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] overflow-hidden">
          <summary className="flex items-center justify-between p-4 sm:p-5 cursor-pointer font-bold text-sm text-[#111827] dark:text-[#F3F4F6] hover:bg-[#FAF8F5] dark:hover:bg-[#1E2330] transition-colors list-none select-none">
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#F5B301]" />
              <span>About {categoryName} (Features &amp; Technical Security)</span>
            </span>
            <span className="text-xs font-medium text-slate-500 group-open:hidden">Read guide &darr;</span>
            <span className="text-xs font-medium text-slate-500 hidden group-open:inline">Collapse &uarr;</span>
          </summary>
          <div className="p-5 sm:p-6 pt-2 border-t border-[#F2EFE9] dark:border-[#202532] text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-3">
            {aboutParagraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </details>
      </section>

      {/* 7. FAQ accordion (collapsed) */}
      {faqs.length > 0 && (
        <section className="mb-10 space-y-3">
          <h2 className="text-lg font-bold text-[#111827] dark:text-[#F3F4F6] flex items-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-[#F5B301]" />
            <span>Frequently Asked Questions</span>
          </h2>
          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] overflow-hidden"
              >
                <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-xs sm:text-sm text-[#111827] dark:text-[#F3F4F6] hover:bg-[#FAF8F5] dark:hover:bg-[#1E2330] transition-colors list-none">
                  <span>{faq.question}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-90 shrink-0 ml-2" />
                </summary>
                <p className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-[#F2EFE9] dark:border-[#202532]">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Related Categories Navigation */}
      {relatedCategories.length > 0 && (
        <section className="pt-4 border-t border-[#EAE6DF] dark:border-[#262B38] flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span>Explore Other Suites:</span>
          {relatedCategories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="text-xs font-semibold text-[#111827] dark:text-white hover:text-[#D97706] dark:hover:text-[#F5B301] inline-flex items-center gap-0.5 underline underline-offset-4"
            >
              <span>{cat.name}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          ))}
        </section>
      )}

      <AdSlot id="category-bottom-ad" className="mt-8" />
    </div>
  );
}
