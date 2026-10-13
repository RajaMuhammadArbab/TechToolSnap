import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import CompressPdf from '@/components/tools/CompressPdf';
import { getToolBySlug } from '@/tools.config';

const slug = 'compress-pdf';
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

export default function CompressPdfPage() {
  return (
    <ToolLayout slug={slug}>
      <CompressPdf />
    </ToolLayout>
  );
}
