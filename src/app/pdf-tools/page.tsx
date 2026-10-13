import { Metadata } from 'next';
import CategoryPageLayout from '@/components/CategoryPageLayout';
import { getToolsByCategory } from '@/tools.config';

export const metadata: Metadata = {
  title: 'Free Online PDF Tools - Merge, Split, Compress & Convert',
  description: 'Manage PDF documents online with free client-side tools. Merge multiple PDFs, extract custom page ranges, compress bloated file size, and convert images to PDF.',
  alternates: {
    canonical: '/pdf-tools',
  },
  openGraph: {
    title: 'Free Online PDF Tools | TechToolSnap',
    description: 'Merge, split, compress, and convert PDF documents in your browser. 100% confidential and free.',
    url: 'https://techtoolsnap.com/pdf-tools',
    type: 'website',
  }
};

export default function PdfToolsPage() {
  const pdfTools = getToolsByCategory('PDF');

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Free Online PDF Tools",
    "description": "Client-side PDF management tools for merging, splitting, compressing, and converting documents.",
    "url": "https://techtoolsnap.com/pdf-tools",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": pdfTools.map((t, idx) => ({
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
        "name": "PDF Tools",
        "item": "https://techtoolsnap.com/pdf-tools"
      }
    ]
  };

  const aboutParagraphs = [
    "The TechToolSnap PDF suite delivers fast, dependable, and completely confidential document processing right in your browser. PDF is the bedrock format for business contracts, tax filings, legal briefs, academic textbooks, and official application exhibits. Yet, modifying or organizing PDF documents traditionally required costly subscriptions or risky file uploads to unknown servers. Our tools eliminate both hurdles.",
    "Whether you need to combine separate PDF statements into one cohesive file, extract specific target chapters from a hundred-page brief, shrink bloated attachment sizes for email delivery, or turn scanned receipts into standardized PDF pages, everything executes locally on your device. Powered by client-side WebAssembly and modern PDF stream manipulation, your confidential contracts and statements never leave your hardware. Enjoy unlimited, watermark-free document tools built for ultimate productivity and peace of mind."
  ];

  const faqs = [
    {
      question: "Is it safe to merge or compress confidential legal contracts here?",
      answer: "Yes. Processing takes place completely in your browser memory using pdf-lib. No document pages or metadata are ever transmitted to any remote cloud server."
    },
    {
      question: "Does compressing a PDF reduce text or font quality?",
      answer: "No. Our compression engine optimizes embedded raster images and font subsets while maintaining 100% sharpness for vector text and tables."
    },
    {
      question: "Can I reorder pages when merging PDFs?",
      answer: "Yes. Simply drag and drop your uploaded files into your preferred sequence before finalizing the merge."
    }
  ];

  const relatedCategories = [
    { name: 'Image Tools', href: '/image-tools' },
    { name: 'Developer Tools', href: '/developer-tools' },
    { name: 'Text & Security', href: '/text-tools' },
    { name: 'Calculators', href: '/calculators' }
  ];

  return (
    <CategoryPageLayout
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      title="Free Online PDF Tools"
      shortIntro="Merge multiple files, extract custom page ranges, compress bloated documents, and convert images into clean PDFs."
      aboutParagraphs={aboutParagraphs}
      tools={pdfTools}
      collectionSchema={collectionSchema}
      breadcrumbSchema={breadcrumbSchema}
      faqs={faqs}
      relatedCategories={relatedCategories}
    />
  );
}
