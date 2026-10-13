import { Metadata } from 'next';
import CategoryPageLayout from '@/components/CategoryPageLayout';
import { getToolsByCategory } from '@/tools.config';

export const metadata: Metadata = {
  title: 'Free Online Developer Tools - Formatters, Encoders & Utilities',
  description: 'Explore our complete suite of free online developer tools. Format JSON, decode JWT & Base64, test regex, convert timestamps, generate UUIDs, and more.',
  alternates: {
    canonical: '/developer-tools',
  },
  openGraph: {
    title: 'Free Online Developer Tools | TechToolSnap',
    description: '100% Client-side developer tools: JSON formatter, Base64, JWT decoder, Regex tester, UUID generator, and color converter.',
    url: 'https://techtoolsnap.com/developer-tools',
    type: 'website',
  }
};

export default function DeveloperToolsPage() {
  const devTools = getToolsByCategory('Developer Tools');

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Free Online Developer Tools",
    "description": "Comprehensive suite of client-side developer utilities including JSON formatters, JWT decoders, Base64 processors, and hash generators.",
    "url": "https://techtoolsnap.com/developer-tools",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": devTools.map((t, idx) => ({
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
        "name": "Developer Tools",
        "item": "https://techtoolsnap.com/developer-tools"
      }
    ]
  };

  const aboutParagraphs = [
    "Welcome to the TechToolSnap Developer Suite — a specialized, privacy-first workbench built for software engineers, backend architects, DevOps specialists, and frontend designers. As engineering workflows increasingly rely on distributed cloud infrastructure, microservices, and secure API integrations, developers frequently encounter daily utility tasks: formatting unreadable JSON API responses, inspecting JWT claims, testing complex regular expressions, generating cryptographically secure UUID identifiers, calculating Unix epoch timestamps, or computing cryptographic SHA digests.",
    "Traditional developer websites force you to transmit API payloads, authentication headers, and database snippets across external internet servers where credentials could be cached in public server logs. Our developer tools eliminate this critical security risk by executing 100% client-side directly within your web browser using modern WebAssembly, native DOM parsers, and the browser Web Cryptography API. Your secret tokens, customer data, and source code never leave your machine. Experience instant hardware-accelerated processing, zero latency, and zero tracking — completely free forever without sign-ups or subscription paywalls."
  ];

  const faqs = [
    {
      question: "Are developer tools safe for confidential production payloads?",
      answer: "Yes, 100%. All formatters, regex matches, UUID generations, and token decoders execute strictly inside your local browser memory using native JavaScript APIs (JSON, RegExp, SubtleCrypto). No network payloads are ever transmitted to any external server."
    },
    {
      question: "Can I use these developer utilities completely offline?",
      answer: "Yes. TechToolSnap functions as an offline-capable Progressive Web App (PWA). Once loaded in your browser cache, all developer utilities execute without active internet connectivity."
    },
    {
      question: "Are there any file size or line limits?",
      answer: "There are no server quotas or arbitrary software locks. The only practical limitation is the RAM capacity of your local device browser session."
    }
  ];

  const relatedCategories = [
    { name: 'Text & Security', href: '/text-tools' },
    { name: 'Calculators', href: '/calculators' },
    { name: 'Image Tools', href: '/image-tools' },
    { name: 'PDF Tools', href: '/pdf-tools' }
  ];

  return (
    <CategoryPageLayout
      categoryName="Developer Tools"
      categorySlug="developer-tools"
      title="Developer Tools & Utilities"
      shortIntro="Fast, private client-side engineering utilities: JSON formatters, JWT decoders, regex testers, and cryptographic generators."
      aboutParagraphs={aboutParagraphs}
      tools={devTools}
      collectionSchema={collectionSchema}
      breadcrumbSchema={breadcrumbSchema}
      faqs={faqs}
      relatedCategories={relatedCategories}
    />
  );
}
