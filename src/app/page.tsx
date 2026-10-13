import Hero from '@/components/Hero';
import BentoToolGrid from '@/components/BentoToolGrid';
import ToolCard from '@/components/ToolCard';
import AdSlot from '@/components/AdSlot';
import { tools } from '@/tools.config';
import { 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  Flame, 
  Flag,
  HelpCircle,
  Lock,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '@/lib/siteConfig';

export default function Home() {
  // Driven dynamically by the popular flag in tools.config.ts
  const popularTools = tools.filter(t => t.popular);

  const pakistanSlugs = ['cnic-photo-resizer', 'passport-size-photo-maker', 'zakat-calculator'];
  const pakistanTools = pakistanSlugs
    .map(slug => tools.find(t => t.slug === slug))
    .filter((t): t is typeof tools[0] => t !== undefined);

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "url": SITE_URL,
    "description": SITE_DESCRIPTION,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_URL}/?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SITE_NAME,
    "url": SITE_URL,
    "logo": `${SITE_URL}/icon.svg`,
    "sameAs": []
  };

  const faqs = [
    {
      q: "Are my files really safe? Do they get uploaded to your servers?",
      a: "Yes, they are 100% safe. TechToolSnap operates entirely client-side using HTML5 Canvas, the Web Crypto API, and WebAssembly inside your browser. No images, PDF documents, or passwords are ever transmitted to any remote server or stored in any database."
    },
    {
      q: "Is there any cost, subscription, or limit on how many files I can process?",
      a: "None whatsoever. All tools are completely free to use without daily quotas, file caps, or premium tiers. You do not even need to create an account."
    },
    {
      q: "Can I use TechToolSnap on my smartphone or tablet?",
      a: "Yes. Every tool is optimized for mobile touchscreens, tablets, and desktop computers. You can even install TechToolSnap as a Progressive Web App (PWA) on iOS and Android for instant offline access."
    },
    {
      q: "Why do government and university portals have strict file size limits?",
      a: "Most institutional portals (such as NADRA, FPSC, UPSC, and HEC) process millions of applications on limited server storage. Strict 20KB–100KB limits ensure fast uploads over 3G/4G connections and prevent database bloat."
    }
  ];

  return (
    <main className="space-y-12 sm:space-y-16 pb-20">
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} 
      />
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} 
      />

      {/* 1. Header is sticky in root layout */}

      {/* 2. Hero (compact, with search bar) */}
      <Hero />

      <div className="container mx-auto px-4 max-w-7xl space-y-12 sm:space-y-16">
        
        {/* 3. Popular Tools (MOVED ABOVE all-tools grid, 12 tools, 2 rows of 6 on desktop, 2 cols on mobile) */}
        <section id="popular" className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DF] dark:border-[#262B38]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 flex items-center justify-center">
                <Flame className="w-4.5 h-4.5 text-[#F5B301]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-[#F3F4F6]">
                  Popular Daily Utilities
                </h2>
                <p className="text-xs text-slate-500">Most frequently used tools by our community</p>
              </div>
            </div>
            <Link
              href="#categories"
              className="text-xs font-bold text-[#D97706] dark:text-[#F5B301] hover:underline flex items-center gap-1"
            >
              <span>View all {tools.length}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 12 Tools: 4 columns on desktop/lg/xl, 3 on sm, 2 on mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {popularTools.map(tool => (
              <ToolCard key={tool.slug} tool={tool} compact={true} />
            ))}
          </div>
        </section>

        {/* 4. Category Tabs + All Tools Grid */}
        <section id="categories" className="space-y-6 pt-2">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827] dark:text-[#F3F4F6]">
              All Tools Suite
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Browse and filter all {tools.length} client-side processing utilities
            </p>
          </div>

          <BentoToolGrid allTools={tools} />
        </section>

        <AdSlot id="home-mid-ad" />

        {/* 5. Pakistan Official Portal Tools section */}
        <section className="p-6 sm:p-8 rounded-3xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5B301] text-[#111827] flex items-center justify-center font-bold shadow-xs">
                <Flag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-[#F3F4F6]">
                  Pakistan Official Portal Tools
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Custom-tailored presets for NADRA e-Sahulat, FPSC, PPSC, and Islamic finance
                </p>
              </div>
            </div>
            <Link 
              href="/blog/how-to-resize-a-photo-for-cnic-online" 
              className="text-xs font-bold text-[#B45309] dark:text-[#F5B301] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              NADRA Specs Guide &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pakistanTools.map(tool => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

        {/* 6. Why Us Architectural Advantages Section */}
        <section className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#F3F4F6]">
              Why TechToolSnap is Different
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Unlike traditional tool websites that upload files to private cloud servers, our architecture runs inside your device.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#11141C] border border-[#EAE6DF] dark:border-[#202532] space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center">
                <Zap className="w-4.5 h-4.5 text-[#F5B301]" />
              </div>
              <h3 className="font-bold text-sm text-[#111827] dark:text-white">Zero Latency</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                No upload wait times. Files are processed instantly using your local device CPU.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5] dark:bg-[#11141C] border border-[#EAE6DF] dark:border-[#202532] space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
              </div>
              <h3 className="font-bold text-sm text-[#111827] dark:text-white">True Privacy</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                National IDs, headshots, and financial PDFs never leave your browser memory.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#11141C] border border-[#EAE6DF] dark:border-[#202532] space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 flex items-center justify-center">
                <Lock className="w-4.5 h-4.5 text-rose-600" />
              </div>
              <h3 className="font-bold text-sm text-[#111827] dark:text-white">Zero Account Tracking</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                No credit cards, email signups, or subscription plans. Everything is free immediately.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#11141C] border border-[#EAE6DF] dark:border-[#202532] space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-800 dark:text-violet-300 flex items-center justify-center">
                <Smartphone className="w-4.5 h-4.5 text-violet-600" />
              </div>
              <h3 className="font-bold text-sm text-[#111827] dark:text-white">PWA &amp; Mobile-Ready</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Optimized for touchscreens with offline-capable progressive web app support.
              </p>
            </div>
          </div>
        </section>

        {/* 7. FAQ Accordion Section */}
        <section className="space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-[#F5B301]" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#F3F4F6]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] overflow-hidden"
              >
                <summary className="flex items-center justify-between p-4 sm:p-5 cursor-pointer font-bold text-xs sm:text-sm text-[#111827] dark:text-[#F3F4F6] hover:bg-[#FAF8F5] dark:hover:bg-[#1E2330] transition-colors list-none">
                  <span>{faq.q}</span>
                  <svg 
                    className="w-4 h-4 text-slate-400 transition-transform duration-200 group-open:rotate-180 shrink-0 ml-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-[#F2EFE9] dark:border-[#202532] pt-3.5">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <AdSlot id="home-bottom-ad" />
      </div>
    </main>
  );
}
