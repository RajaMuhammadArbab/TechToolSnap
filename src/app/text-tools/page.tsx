import { Metadata } from 'next';
import CategoryPageLayout from '@/components/CategoryPageLayout';
import { getToolsByCategory } from '@/tools.config';

export const metadata: Metadata = {
  title: 'Free Online Text & Security Tools - Word Counter, QR & Password',
  description: 'Boost your productivity with free browser-based text and utility tools. Count words and characters, generate scannable QR codes, and create unhackable passwords.',
  alternates: {
    canonical: '/text-tools',
  },
  openGraph: {
    title: 'Free Online Text & Security Tools | TechToolSnap',
    description: 'Real-time text analysis, cryptographic password generation, and custom QR code creation. 100% private and free.',
    url: 'https://techtoolsnap.com/text-tools',
    type: 'website',
  }
};

export default function TextToolsPage() {
  const textTools = getToolsByCategory('Text');

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Free Online Text & Security Tools",
    "description": "Essential client-side text counters, QR generators, and cryptographic security tools.",
    "url": "https://techtoolsnap.com/text-tools",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": textTools.map((t, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": t.title,
        "url": `https://techtoolsnap.com/${t.slug}`
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
        "name": "Text Tools",
        "item": "https://techtoolsnap.com/text-tools"
      }
    ]
  };

  const aboutParagraphs = [
    "TechToolSnap Text & Security utilities empower writers, editors, administrators, and security professionals with zero-compromise browser tools. Whether you are analyzing long-form essays and character counts or generating hardened authentication keys, our tools execute instantaneously.",
    "Count words, paragraphs, and characters in real time without lag, design custom branded QR codes for contact cards and menus, or generate 256-bit cryptographically random passwords utilizing the hardware-backed Web Cryptography API. Every calculation executes in local device memory, guaranteeing zero telemetry and complete privacy."
  ];

  const faqs = [
    {
      question: "Are my passwords generated securely without server logging?",
      answer: "Yes. All passwords are created via window.crypto.getRandomValues directly on your device CPU. They are never sent across the internet."
    },
    {
      question: "Do the QR codes created here expire?",
      answer: "No. The QR codes are permanent static codes encoding your text or URL directly into the matrix pattern."
    },
    {
      question: "Can I count words in large documents?",
      answer: "Yes. Our word counter analyzes tens of thousands of words in real time with instant character and paragraph breakdown statistics."
    }
  ];

  const relatedCategories = [
    { name: 'Developer Tools', href: '/developer-tools' },
    { name: 'Image Tools', href: '/image-tools' },
    { name: 'PDF Tools', href: '/pdf-tools' },
    { name: 'Calculators', href: '/calculators' }
  ];

  return (
    <CategoryPageLayout
      categoryName="Text & Security"
      categorySlug="text-tools"
      title="Free Online Text & Security Tools"
      shortIntro="Real-time word and character counters, permanent QR code generators, and cryptographically random password creation."
      aboutParagraphs={aboutParagraphs}
      tools={textTools}
      collectionSchema={collectionSchema}
      breadcrumbSchema={breadcrumbSchema}
      faqs={faqs}
      relatedCategories={relatedCategories}
    />
  );
}
