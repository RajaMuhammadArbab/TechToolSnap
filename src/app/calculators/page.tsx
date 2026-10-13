import { Metadata } from 'next';
import CategoryPageLayout from '@/components/CategoryPageLayout';
import { getToolsByCategory } from '@/tools.config';

export const metadata: Metadata = {
  title: 'Free Online Calculators - Academic, Financial & Daily Math',
  description: 'Fast, accurate, and interactive free online calculators. Calculate GPA/CGPA, exact age down to the day, multi-mode percentages, and Islamic Zakat.',
  alternates: {
    canonical: '/calculators',
  },
  openGraph: {
    title: 'Free Online Calculators | TechToolSnap',
    description: 'Instant and accurate calculators for academic grades, percentages, age calculation, and Zakat. 100% free and private.',
    url: 'https://techtoolsnap.com/calculators',
    type: 'website',
  }
};

export default function CalculatorsPage() {
  const calcTools = getToolsByCategory('Calculators');

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Free Online Calculators",
    "description": "Collection of fast, interactive, and private online calculators.",
    "url": "https://techtoolsnap.com/calculators",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": calcTools.map((t, idx) => ({
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
        "name": "Calculators",
        "item": "https://techtoolsnap.com/calculators"
      }
    ]
  };

  const aboutParagraphs = [
    "TechToolSnap provides an interactive suite of clean, instant calculators designed to replace complicated math and spreadsheets with streamlined precision. From university grading scales to annual financial duties, our tools offer immediate calculation with comprehensive breakdown cards.",
    "Whether you are planning your semester GPA according to official HEC guidelines, calculating exact percentage increases and discounts, determining your exact chronological age in days and hours, or calculating your obligatory Zakat on gold and savings, our calculators compute values entirely client-side. No financial figures or personal records are ever stored or shared."
  ];

  const faqs = [
    {
      question: "Which grading scale does the GPA Calculator use?",
      answer: "The GPA Calculator uses standard 4.0 credit-weighted scales compliant with Pakistani Higher Education Commission (HEC) and international university systems."
    },
    {
      question: "Are my financial values private when calculating Zakat?",
      answer: "Yes, 100%. All computations execute in local browser memory. Your bank savings and gold weights are never transmitted or logged anywhere."
    },
    {
      question: "Can I use these calculators on my smartphone?",
      answer: "Yes. Every calculator features touch-friendly inputs and responsive result cards optimized for mobile screens."
    }
  ];

  const relatedCategories = [
    { name: 'Developer Tools', href: '/developer-tools' },
    { name: 'Text & Security', href: '/text-tools' },
    { name: 'Image Tools', href: '/image-tools' },
    { name: 'PDF Tools', href: '/pdf-tools' }
  ];

  return (
    <CategoryPageLayout
      categoryName="Calculators"
      categorySlug="calculators"
      title="Free Online Calculators"
      shortIntro="Fast, accurate interactive tools for GPA and CGPA, exact chronological age, multi-mode percentages, and Zakat."
      aboutParagraphs={aboutParagraphs}
      tools={calcTools}
      collectionSchema={collectionSchema}
      breadcrumbSchema={breadcrumbSchema}
      faqs={faqs}
      relatedCategories={relatedCategories}
    />
  );
}
