import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the Terms of Service for TechToolSnap. Understand your rights and responsibilities when using our free online tools.",
  alternates: { canonical: '/terms' },
  openGraph: {
    title: "Terms of Service | TechToolSnap",
    description: "Read the Terms of Service for TechToolSnap.",
    url: 'https://techtoolsnap.com/terms',
  }
};

export default function Terms() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-3xl">
      <Breadcrumbs items={[{ name: 'Terms of Service', url: '/terms' }]} />
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Last updated: October 10, 2026</p>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>By accessing and using TechToolSnap, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website.</p>

          <h2>1. Use of Tools</h2>
          <p>Our tools are provided &quot;as is&quot; and free of charge for personal and commercial use. You may use any tool on this website without creating an account or providing personal information. You agree not to abuse, reverse-engineer, or attempt to disrupt the service.</p>

          <h2>2. Client-Side Processing</h2>
          <p>All tools on TechToolSnap process data locally within your web browser. We do not receive, store, or transmit any files or data you process. You are solely responsible for any files you upload or process using our tools.</p>

          <h2>3. Intellectual Property</h2>
          <p>The content, design, and code of TechToolSnap are protected by copyright. You may not copy, redistribute, or create derivative works from our website without prior written permission.</p>

          <h2>4. Limitation of Liability</h2>
          <p>TechToolSnap and its owners shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of our tools. This includes, but is not limited to, data loss, incorrect calculations, file corruption, or any other damages. Please verify results independently for critical or professional tasks.</p>

          <h2>5. Third-Party Services</h2>
          <p>Our website may contain advertisements served by third-party networks such as Google AdSense. These services operate under their own terms and privacy policies. We are not responsible for the content or practices of any third-party services.</p>

          <h2>6. Modifications</h2>
          <p>We reserve the right to modify these Terms of Service at any time. Continued use of the website after changes constitutes acceptance of the updated terms.</p>

          <h2>7. Contact</h2>
          <p>For any questions about these terms, please contact us at: <a href="mailto:support@techtoolsnap.com">support@techtoolsnap.com</a></p>
        </div>
      </div>
    </main>
  );
}
