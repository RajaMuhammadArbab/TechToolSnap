import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = { 
  title: "About Us",
  description: "Learn more about TechToolSnap and our commitment to free, secure, and client-side online tools.",
  alternates: { canonical: '/about' },
  openGraph: {
    title: "About Us | TechToolSnap",
    description: "Learn more about TechToolSnap and our commitment to free, secure, and client-side online tools.",
    url: 'https://techtoolsnap.com/about',
  }
};

export default function About() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-3xl">
      <Breadcrumbs items={[{ name: 'About Us', url: '/about' }]} />
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8 text-center">About TechToolSnap</h1>
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Mission</h2>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          TechToolSnap is a collection of free, fast, and secure online tools designed to make your daily tasks easier. From image compression to PDF conversion and everyday calculators, we aim to provide the best tools completely free of charge.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Privacy First</h2>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          Our core philosophy is privacy. Unlike other tool websites that require you to upload files to their servers, all of our tools process your data locally in your browser. This means your files, text, and personal data never leave your device.
        </p>
      </div>
    </main>
  );
}
