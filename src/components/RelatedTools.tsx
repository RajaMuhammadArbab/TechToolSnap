import Link from 'next/link';
import { tools } from '@/tools.config';
import { blogPosts } from '@/lib/blog';
import { BookOpen, ArrowUpRight } from 'lucide-react';
import { getCategoryStyle } from './ToolCard';

export default function RelatedTools({ currentSlug, category }: { currentSlug: string; category: string }) {
  // Target 5-6 related tools
  const sameCategory = tools.filter(t => t.category === category && t.slug !== currentSlug);
  const otherCategory = tools.filter(t => t.category !== category && t.slug !== currentSlug);
  
  const selectedSame = sameCategory.slice(0, 4);
  const remainingNeeded = Math.max(0, 6 - selectedSame.length);
  const selectedOther = otherCategory.slice(0, remainingNeeded);
  const relatedTools = [...selectedSame, ...selectedOther].slice(0, 6);

  // Link 1-2 relevant blog posts
  const relevantPosts = blogPosts.filter(p => 
    p.relatedToolSlug === currentSlug || 
    (category === 'Image' && p.category.includes('Image')) ||
    (category === 'PDF' && p.category.includes('PDF')) ||
    (category === 'Text' && p.category.includes('Security'))
  ).slice(0, 2);

  const fallbackPosts = blogPosts.slice(0, 2);
  const displayPosts = relevantPosts.length >= 1 ? relevantPosts : fallbackPosts;

  return (
    <section className="w-full space-y-10">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#F3F4F6] mb-6">
          Related Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {relatedTools.map(tool => {
            const style = getCategoryStyle(tool.category, tool.slug);
            return (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                title={tool.title}
                className="group rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] p-5 hover:shadow-md hover:border-[#F5B301] transition-all block"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${style.badge}`}>
                    {tool.category}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#F5B301] transition-colors" />
                </div>
                <h3 className="font-bold text-base text-[#111827] dark:text-[#F3F4F6] mb-1.5 group-hover:text-[#D97706] dark:group-hover:text-[#F5B301] transition-colors leading-snug line-clamp-2">
                  {tool.shortTitle || tool.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {displayPosts.length > 0 && (
        <div className="pt-6 border-t border-[#EAE6DF] dark:border-[#262B38]">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-[#F5B301]" />
            </div>
            <h2 className="text-xl font-bold text-[#111827] dark:text-[#F3F4F6]">
              Helpful Guides &amp; Tutorials
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayPosts.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group p-5 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] hover:border-[#F5B301] transition-all block"
              >
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#D97706] dark:text-[#F5B301] mb-1.5">
                  {post.category} · {post.readingTime}
                </div>
                <h3 className="font-bold text-sm sm:text-base text-[#111827] dark:text-[#F3F4F6] group-hover:text-[#D97706] dark:group-hover:text-[#F5B301] transition-colors line-clamp-2 mb-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {post.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
