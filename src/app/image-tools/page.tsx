import { Metadata } from 'next';
import CategoryPageLayout from '@/components/CategoryPageLayout';
import { getToolsByCategory } from '@/tools.config';

export const metadata: Metadata = {
  title: 'Free Online Image Tools - Compress, Resize & Convert Photos',
  description: 'Explore our complete suite of free online image tools. Compress images to exact KB limits, resize dimensions, convert JPG/PNG/WebP, and create passport photos.',
  alternates: {
    canonical: '/image-tools',
  },
  openGraph: {
    title: 'Free Online Image Tools | TechToolSnap',
    description: 'Compress, resize, convert, and format photos client-side in your browser. 100% private and free.',
    url: 'https://techtoolsnap.com/image-tools',
    type: 'website',
  }
};

export default function ImageToolsPage() {
  const imageTools = getToolsByCategory('Image');

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Free Online Image Tools",
    "description": "Comprehensive suite of client-side image compression, resizing, and conversion tools.",
    "url": "https://techtoolsnap.com/image-tools",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": imageTools.map((t, idx) => ({
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
        "name": "Image Tools",
        "item": "https://techtoolsnap.com/image-tools"
      }
    ]
  };

  const aboutParagraphs = [
    "Welcome to the TechToolSnap Image Toolkit — an all-in-one collection of browser-native utilities designed to handle everyday photographic and graphic tasks without installing software or paying recurring subscriptions. Whether you need to compress photos to precise government form constraints (such as 20KB, 50KB, 100KB, or 200KB), resize dimensions by exact pixels or percentage, convert between modern WebP, JPG, and PNG formats, or format official biometric passport photos, every tool delivers professional fidelity instantly.",
    "Unlike traditional cloud photo converters that upload your personal pictures, family photos, and confidential ID scans to remote servers, all image processing at TechToolSnap takes place 100% client-side inside your web browser. Utilizing high-performance HTML5 Canvas APIs and client-side WebAssembly, your images are analyzed, resampled, and compressed directly in local device memory. Your confidential files never travel across the internet, guaranteeing complete data privacy, zero server lag, and lightning-fast batch processing."
  ];

  const faqs = [
    {
      question: "Are my uploaded photos stored on your web servers?",
      answer: "No. TechToolSnap processes images directly inside your browser using HTML5 Canvas and WebAssembly. Your photos never leave your device."
    },
    {
      question: "Can I compress multiple images simultaneously in batch mode?",
      answer: "Yes. Our image compressor tools support multi-file batch uploads with single-click ZIP archive downloads."
    },
    {
      question: "Which formats are supported for conversion?",
      answer: "We support seamless two-way conversion between JPG, PNG, and modern WebP image formats."
    }
  ];

  const relatedCategories = [
    { name: 'PDF Tools', href: '/pdf-tools' },
    { name: 'Developer Tools', href: '/developer-tools' },
    { name: 'Calculators', href: '/calculators' },
    { name: 'Text & Security', href: '/text-tools' }
  ];

  return (
    <CategoryPageLayout
      categoryName="Image Tools"
      categorySlug="image-tools"
      title="Free Online Image Tools"
      shortIntro="Compress photos to exact KB targets, resize dimensions, and convert JPG, PNG, and WebP instantly in your browser."
      aboutParagraphs={aboutParagraphs}
      tools={imageTools}
      collectionSchema={collectionSchema}
      breadcrumbSchema={breadcrumbSchema}
      faqs={faqs}
      relatedCategories={relatedCategories}
    />
  );
}
