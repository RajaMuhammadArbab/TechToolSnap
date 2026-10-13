import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with TechToolSnap. Send us your feedback, feature requests, or questions.",
  alternates: { canonical: '/contact' },
  openGraph: {
    title: "Contact Us | TechToolSnap",
    description: "Get in touch with TechToolSnap. Send us your feedback, feature requests, or questions.",
    url: 'https://techtoolsnap.com/contact',
  }
};

export default function Contact() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-3xl">
      <Breadcrumbs items={[{ name: 'Contact Us', url: '/contact' }]} />
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8 text-center">Contact Us</h1>
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          We would love to hear from you! Whether you have a question about our tools, a feature request, or just want to say hello, feel free to reach out.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Email</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-4">The fastest way to contact us is by email:</p>
        <a href="mailto:support@techtoolsnap.com" className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-3 rounded-xl transition-colors mb-8">
          support@techtoolsnap.com
        </a>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">What can you contact us about?</h2>
        <ul className="space-y-3 text-slate-600 dark:text-slate-300 mb-8 list-disc list-inside">
          <li><strong className="text-slate-900 dark:text-white">Bug reports:</strong> If a tool is not working as expected, please describe the issue and the browser you are using.</li>
          <li><strong className="text-slate-900 dark:text-white">Feature requests:</strong> We are always looking for new tools to add. Tell us what you need!</li>
          <li><strong className="text-slate-900 dark:text-white">Feedback:</strong> General feedback about the website, design, or user experience is always welcome.</li>
          <li><strong className="text-slate-900 dark:text-white">Business inquiries:</strong> For partnership or advertising questions, reach out via the email above.</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Response Time</h2>
        <p className="text-slate-600 dark:text-slate-300">
          We aim to respond to all emails within 48 hours. Thank you for your patience!
        </p>
      </div>
    </main>
  );
}
