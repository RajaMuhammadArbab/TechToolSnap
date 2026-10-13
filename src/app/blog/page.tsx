import { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts } from '@/lib/blog';
import { Clock, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import AdSlot from '@/components/AdSlot';

export const metadata: Metadata = {
  title: 'Blog & Practical Guides - Image, PDF & Privacy Tutorials',
  description: 'Explore step-by-step guides, privacy tutorials, and digital productivity tips from the TechToolSnap technical team.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Blog & Practical Guides | TechToolSnap',
    description: 'Expert guides on image compression, PDF optimization, and digital security. 100% free and client-side.',
    url: 'https://techtoolsnap.com/blog',
    type: 'website',
  }
};

export default function BlogIndexPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "TechToolSnap Blog & Tutorials",
    "description": "Guides and tutorials on digital optimization and client-side privacy.",
    "url": "https://techtoolsnap.com/blog",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": blogPosts.map((post, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": post.title,
        "url": `https://techtoolsnap.com/blog/${post.slug}`
      }))
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://techtoolsnap.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://techtoolsnap.com/blog"
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-slate-500">
          <li><Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link></li>
          <li><span>/</span></li>
          <li className="text-slate-800 dark:text-slate-200 font-medium">Blog & Guides</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-12 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          Guides & Tutorials
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Articles, How-Tos & Optimization Guides
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          In-depth technical guides written by our engineers on compressing images, optimizing PDFs, safeguarding digital passwords, and getting the most out of browser-native tools.
        </p>
      </header>

      <AdSlot id="blog-top-ad" className="mb-12" />

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {blogPosts.map((post) => (
          <article
            key={post.slug}
            className="flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all group"
          >
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center justify-between gap-2 text-xs mb-3">
                <span className="font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3 h-3" />
                  {post.readingTime}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2 leading-snug">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6 flex-grow leading-relaxed">
                {post.description}
              </p>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 text-white font-bold text-xs flex items-center justify-center">
                    {post.author.avatar}
                  </div>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {post.author.name}
                  </span>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1"
                >
                  Read &rarr;
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <AdSlot id="blog-bottom-ad" />
    </div>
  );
}
