import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import PdfMerge from '@/components/tools/PdfMerge';
import { getToolBySlug } from '@/tools.config';

const slug = 'pdf-merge';
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

export default function PdfMergePage() {
  return (
    <ToolLayout slug={slug}>
      <PdfMerge />
    </ToolLayout>
  );
}
