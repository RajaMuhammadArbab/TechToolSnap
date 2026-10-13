import Link from 'next/link';
import { tools } from '@/tools.config';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const devTools = tools.filter(t => t.category === 'Developer Tools');
  const imageTools = tools.filter(t => t.category === 'Image');
  const pdfTools = tools.filter(t => t.category === 'PDF');
  const calcTools = tools.filter(t => t.category === 'Calculators');
  const textTools = tools.filter(t => t.category === 'Text');

  return (
    <footer className="bg-[#111827] text-slate-400 pt-16 pb-10 border-t border-[#1F2937]">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Brand Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-12 border-b border-[#1F2937] gap-6">
          <div className="max-w-xl">
            <Link href="/" className="flex items-center gap-2.5 mb-3 group">
              <div className="w-8 h-8 rounded-xl bg-teal-700 flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M13 2L4.5 13.5H11.5L11 22L19.5 10.5H12.5L13 2Z"
                    fill="white"
                    stroke="white"
                    strokeWidth="0.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Tech<span className="text-teal-400">Tool</span>Snap
              </span>
            </Link>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
              100% Free, privacy-first online utility suite. All developer tools, image compression, PDF operations, calculators, and file conversions execute locally in your web browser.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Zero Cloud Uploads · Private
            </span>
            <Link
              href="/blog"
              className="text-xs font-bold text-[#F5B301] hover:text-white bg-[#1F2937] border border-[#374151] px-3.5 py-1.5 rounded-full transition-colors inline-flex items-center gap-1"
            >
              Browse 13 Guides <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Categorized Tools Grid (5 Columns) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 py-12 border-b border-[#1F2937]">
          {/* Developer Tools */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Link href="/developer-tools" className="text-white font-bold text-sm hover:text-[#F5B301] transition-colors">
                Developer Tools ({devTools.length})
              </Link>
            </div>
            <ul className="space-y-2 text-xs">
              {devTools.map(tool => (
                <li key={tool.slug}>
                  <Link href={`/${tool.slug}`} className="hover:text-white transition-colors block line-clamp-1">
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Image Tools */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Link href="/image-tools" className="text-white font-bold text-sm hover:text-[#F5B301] transition-colors">
                Image Tools ({imageTools.length})
              </Link>
            </div>
            <ul className="space-y-2 text-xs">
              {imageTools.map(tool => (
                <li key={tool.slug}>
                  <Link href={`/${tool.slug}`} className="hover:text-white transition-colors block line-clamp-1">
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* PDF Tools */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Link href="/pdf-tools" className="text-white font-bold text-sm hover:text-[#F5B301] transition-colors">
                PDF Tools ({pdfTools.length})
              </Link>
            </div>
            <ul className="space-y-2 text-xs">
              {pdfTools.map(tool => (
                <li key={tool.slug}>
                  <Link href={`/${tool.slug}`} className="hover:text-white transition-colors block line-clamp-1">
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Calculators */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Link href="/calculators" className="text-white font-bold text-sm hover:text-[#F5B301] transition-colors">
                Calculators ({calcTools.length})
              </Link>
            </div>
            <ul className="space-y-2 text-xs">
              {calcTools.map(tool => (
                <li key={tool.slug}>
                  <Link href={`/${tool.slug}`} className="hover:text-white transition-colors block line-clamp-1">
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Text & Legal */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Link href="/text-tools" className="text-white font-bold text-sm hover:text-[#F5B301] transition-colors">
                Text &amp; Security ({textTools.length})
              </Link>
            </div>
            <ul className="space-y-2 text-xs mb-6">
              {textTools.map(tool => (
                <li key={tool.slug}>
                  <Link href={`/${tool.slug}`} className="hover:text-white transition-colors block line-clamp-1">
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider text-slate-300">Company &amp; Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {currentYear} TechToolSnap. All rights reserved.</p>
          <p>Built with privacy and speed in mind · Zero analytics or telemetry tracking</p>
        </div>
      </div>
    </footer>
  );
}
