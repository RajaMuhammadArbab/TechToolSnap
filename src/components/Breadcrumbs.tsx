import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const schemaItems = [
    { name: 'Home', url: 'https://techtoolsnap.com' },
    ...items.map(item => ({
      name: item.name,
      url: item.url.startsWith('http') ? item.url : `https://techtoolsnap.com${item.url}`
    }))
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: schemaItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center text-xs md:text-sm text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          Home
        </Link>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <React.Fragment key={item.url}>
              <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-400 shrink-0" />
              {isLast ? (
                <span className="text-slate-800 dark:text-slate-200 font-medium" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link href={item.url} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {item.name}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </>
  );
}
