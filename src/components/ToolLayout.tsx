import React from 'react';
import Link from 'next/link';
import { getToolBySlug } from '@/tools.config';
import AdSlot from './AdSlot';
import FAQAccordion from './FAQAccordion';
import RelatedTools from './RelatedTools';
import RecentTracker from './RecentTracker';
import { Check, ShieldCheck, Zap, Lock, ChevronRight } from 'lucide-react';
import { SITE_URL, SITE_NAME } from '@/lib/siteConfig';

export default function ToolLayout({ slug, children }: { slug: string; children: React.ReactNode }) {
  const tool = getToolBySlug(slug);
  
  if (!tool) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Tool not found</h1>
        <Link href="/" className="text-[#D97706] hover:underline">Return to Homepage</Link>
      </div>
    );
  }

  const defaultSteps = [
    { title: 'Select File', description: 'Choose or drag & drop your file directly into the browser dropzone.' },
    { title: 'Process In-Memory', description: 'Your file is resized, converted, or compressed locally using client-side WebAssembly.' },
    { title: 'Save Output', description: 'Download your optimized file immediately with zero server retention.' }
  ];

  const defaultFeatures = [
    'Zero cloud uploads — 100% private in-browser processing',
    'Completely free with no hidden paywalls or subscription caps',
    'Optimized for mobile touchscreens and desktop browsers',
    'Maintains highest image sharpness and vector fidelity'
  ];

  const steps = tool.steps && tool.steps.length > 0 ? tool.steps : defaultSteps;
  const features = tool.features && tool.features.length > 0 ? tool.features : defaultFeatures;

  const faqSchema = tool.faqs && tool.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": tool.faqs.map((faq) => ({
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
        "item": `${SITE_URL}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": tool.category,
        "item": `${SITE_URL}/#${tool.category.toLowerCase()}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": tool.title,
        "item": `${SITE_URL}/${tool.slug}`
      }
    ]
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": tool.title,
    "description": tool.description,
    "applicationCategory": "Utility",
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <article className="max-w-5xl mx-auto px-4 py-8">
      <RecentTracker slug={slug} />
      {faqSchema && (
        <script 
          type="application/ld+json" 
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} 
        />
      )}
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} 
      />
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} 
      />
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <li>
            <Link href="/" className="hover:text-[#D97706] dark:hover:text-[#F5B301] transition-colors">
              Home
            </Link>
          </li>
          <li><ChevronRight className="w-3.5 h-3.5 text-slate-400" /></li>
          <li>
            <Link href={`/#${tool.category.toLowerCase()}`} className="capitalize hover:text-[#D97706] dark:hover:text-[#F5B301] transition-colors">
              {tool.category}
            </Link>
          </li>
          <li><ChevronRight className="w-3.5 h-3.5 text-slate-400" /></li>
          <li className="text-[#111827] dark:text-[#F3F4F6] font-semibold truncate max-w-[180px] sm:max-w-md">
            {tool.title}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111827] dark:text-[#F3F4F6] tracking-tight mb-4">
          {tool.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {tool.description}
        </p>

        {/* Quick Trust Strip on Tool Page */}
        <div className="inline-flex items-center gap-4 mt-5 px-4 py-2 rounded-full bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-xs font-semibold text-slate-600 dark:text-slate-400 shadow-2xs">
          <span className="flex items-center gap-1.5 text-emerald-600">
            <ShieldCheck className="w-4 h-4" /> Client-Side
          </span>
          <span>·</span>
          <span className="flex items-center gap-1.5 text-amber-600">
            <Zap className="w-4 h-4" /> Fast &amp; Free
          </span>
          <span>·</span>
          <span className="flex items-center gap-1.5 text-sky-600">
            <Lock className="w-4 h-4" /> No Uploads
          </span>
        </div>
      </header>

      {/* Main Tool Card */}
      <section className="mb-12">
        <div className="bg-white dark:bg-[#171A23] rounded-3xl shadow-sm border border-[#EAE6DF] dark:border-[#262B38] p-6 md:p-10">
          {children}
        </div>
      </section>

      <AdSlot id="tool-below-ad" className="mb-16" />

      {/* How to Use Section */}
      <section className="mb-16">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#F3F4F6] mb-8 text-center sm:text-left">
          How to Use {tool.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-white dark:bg-[#171A23] p-6 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="w-11 h-11 rounded-xl bg-[#F5B301] text-[#111827] flex items-center justify-center font-extrabold text-base mb-4 shadow-xs">
                {idx + 1}
              </div>
              <h3 className="font-bold text-base sm:text-lg text-[#111827] dark:text-[#F3F4F6] mb-2">
                {step.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose / Benefits Section */}
      <section className="mb-16">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#F3F4F6] mb-8 text-center sm:text-left">
          Key Advantages
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3.5 p-5 rounded-2xl bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38]">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Long-form Helpful Content Section */}
      {tool.content && tool.content.length > 0 && (
        <section className="mb-16 bg-white dark:bg-[#171A23] rounded-3xl border border-[#EAE6DF] dark:border-[#262B38] p-6 sm:p-10 prose dark:prose-invert max-w-none">
          {tool.content.map((sec, idx) => (
            <div key={idx} className="mb-8 last:mb-0">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-[#F3F4F6] mb-4">
                {sec.title}
              </h2>
              {sec.body.map((p, pIdx) => (
                <p key={pIdx} className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-4 last:mb-0">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </section>
      )}

      <AdSlot id="content-mid-ad" className="mb-16" />

      {/* FAQ Accordion */}
      {tool.faqs && tool.faqs.length > 0 && (
        <div className="mb-16">
          <FAQAccordion faqs={tool.faqs} />
        </div>
      )}

      {/* Related Tools */}
      <div className="mb-16">
        <RelatedTools currentSlug={tool.slug} category={tool.category} />
      </div>

      <AdSlot id="page-bottom-ad" />
    </article>
  );
}
