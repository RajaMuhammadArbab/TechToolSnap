import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import PdfSplit from '@/components/tools/PdfSplit';
import { getToolBySlug } from '@/tools.config';

const slug = 'pdf-split';
const tool = getToolBySlug(slug);

export const metadata: Metadata = {
  title: tool?.title,
  description: tool?.description,
  keywords: tool?.keywords.join(', '),
  alternates: {
    canonical: `/${slug}`,
  },
  openGraph: {
    title: tool?.title,
    description: tool?.description,
    url: `https://techtoolsnap.com/${slug}`,
    type: 'website',
  }
};

export default function PdfSplitPage() {
  return (
    <ToolLayout slug={slug}>
      <PdfSplit />
    </ToolLayout>
  );
}
