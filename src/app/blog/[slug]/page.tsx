import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogPosts, getBlogPostBySlug } from '@/lib/blog';
import { getToolBySlug } from '@/tools.config';
import { Clock, Calendar, ArrowLeft, ArrowRight, Share2, Sparkles, BookOpen } from 'lucide-react';
import AdSlot from '@/components/AdSlot';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: 'Article Not Found' };
  }

  return {
    title: `${post.title} | QuickToolsHub`,
    description: post.description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: `${post.title} | QuickToolsHub`,
      description: post.description,
      url: `https://quicktoolshub.com/blog/${slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    }
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedTool = post.relatedToolSlug ? getToolBySlug(post.relatedToolSlug) : null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "datePublished": post.publishedAt,
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "jobTitle": post.author.role
    },
    "publisher": {
      "@type": "Organization",
      "name": "QuickToolsHub",
      "url": "https://quicktoolshub.com"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://quicktoolshub.com/blog/${post.slug}`
    }
  };

  const faqSchema = post.faqs && post.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://quicktoolshub.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://quicktoolshub.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://quicktoolshub.com/blog/${post.slug}`
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-slate-500 truncate">
          <li><Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link></li>
          <li><span>/</span></li>
          <li><Link href="/blog" className="hover:text-indigo-600 transition-colors">Blog</Link></li>
          <li><span>/</span></li>
          <li className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs">{post.title}</li>
        </ol>
      </nav>

      {/* Article Header */}
      <header className="mb-12">
        <div className="flex items-center gap-3 text-xs font-semibold mb-4">
          <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            {post.readingTime}
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            {post.publishedAt}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
          {post.title}
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
          {post.description}
        </p>

        {/* Author badge */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 text-white font-bold flex items-center justify-center">
            {post.author.avatar}
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">{post.author.name}</div>
            <div className="text-xs text-slate-500">{post.author.role}</div>
          </div>
        </div>
      </header>

      <AdSlot id="article-top-ad" className="mb-12" />

      {/* Main Content & Sticky TOC Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Table of Contents (Sticky on Desktop) */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 order-2 lg:order-1">
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              Table of Contents
            </div>
            <nav className="space-y-1.5 text-xs sm:text-sm font-medium">
              {post.toc.map((item, idx) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block py-1 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {idx + 1}. {item.title}
                </a>
              ))}
            </nav>
          </div>

          {/* Related Free Tool Callout Card */}
          {relatedTool && (
            <div className="mt-6 p-6 rounded-3xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-center space-y-3 shadow-xs">
              <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto" />
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                Try {relatedTool.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {relatedTool.description}
              </p>
              <Link
                href={`/${relatedTool.slug}`}
                className="inline-flex items-center gap-1.5 py-2.5 px-5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Launch Tool Free &rarr;
              </Link>
            </div>
          )}
        </aside>

        {/* Article Body */}
        <main className="lg:col-span-8 order-1 lg:order-2 space-y-10">
          {post.content.map((sec) => (
            <section key={sec.sectionId} id={sec.sectionId} className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {sec.title}
              </h2>
              {sec.paragraphs.map((p, pIdx) => (
                <p 
                  key={pIdx} 
                  className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line"
                >
                  {p}
                </p>
              ))}
            </section>
          ))}

          <AdSlot id="article-mid-ad" className="my-8" />

          {/* FAQ Section */}
          {post.faqs && post.faqs.length > 0 && (
            <section id="faq" className="scroll-mt-24">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {post.faqs.map((faq, idx) => (
                  <details
                    key={idx}
                    className="group border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 overflow-hidden"
                  >
                    <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors list-none">
                      <span>{faq.question}</span>
                      <svg className="w-5 h-5 text-slate-400 transition-transform duration-300 group-open:rotate-180 shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <p className="px-5 pb-5 text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-4">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Author Box at Bottom */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left mt-12 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-500 text-white font-extrabold text-2xl flex items-center justify-center flex-shrink-0 shadow-md">
              {post.author.avatar}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Written By</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{post.author.name}</h3>
              <p className="text-xs text-slate-500 mb-2">{post.author.role}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Dedicated to helping internet users master digital optimization, client-side encryption, and privacy-preserving tools.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Articles
            </Link>
          </div>
        </main>
      </div>

      <AdSlot id="article-bottom-ad" className="mt-16" />
    </div>
  );
}
