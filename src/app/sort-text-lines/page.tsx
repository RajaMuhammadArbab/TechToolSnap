import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import SortTextLines from '@/components/tools/SortTextLines';
import { getToolBySlug } from '@/tools.config';

const slug = 'sort-text-lines';
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

export default function SortTextLinesPage() {
  return (
    <ToolLayout slug={slug}>
      <SortTextLines />
    </ToolLayout>
  );
}
