import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Disclaimer for TechToolSnap. Understand the limitations of the tools and information provided on this website.",
  alternates: { canonical: '/disclaimer' },
  openGraph: {
    title: "Disclaimer | TechToolSnap",
    description: "Disclaimer for TechToolSnap. Understand the limitations of the tools provided.",
    url: 'https://techtoolsnap.com/disclaimer',
  }
};

export default function Disclaimer() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-3xl">
      <Breadcrumbs items={[{ name: 'Disclaimer', url: '/disclaimer' }]} />
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Disclaimer</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Last updated: October 10, 2026</p>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>General Disclaimer</h2>
          <p>The information and tools provided on TechToolSnap are for general informational and utility purposes only. While we strive to keep our tools accurate and up-to-date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the tools or information provided.</p>

          <h2>Use at Your Own Risk</h2>
          <p>Any reliance you place on the results from our tools is strictly at your own risk. For critical or professional tasks, we strongly recommend verifying all results independently using established software or professional services.</p>

          <h2>No Professional Advice</h2>
          <p>Our calculator and converter tools do not constitute professional financial, legal, medical, or any other form of professional advice. Always consult a qualified professional for specific needs.</p>

          <h2>External Links</h2>
          <p>This website may contain links to external websites that are not provided or maintained by us. We have no control over the content or availability of those sites and accept no responsibility for them.</p>

          <h2>Advertising</h2>
          <p>TechToolSnap displays third-party advertisements through Google AdSense. The appearance of any advertisement does not constitute an endorsement of the advertised product or service. We are not responsible for the content of any third-party advertisements.</p>

          <h2>Contact</h2>
          <p>If you have questions about this Disclaimer, please contact us at: <a href="mailto:support@techtoolsnap.com">support@techtoolsnap.com</a></p>
        </div>
      </div>
    </main>
  );
}
