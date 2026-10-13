import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import RemoveDuplicateLines from '@/components/tools/RemoveDuplicateLines';
import { getToolBySlug } from '@/tools.config';

const slug = 'remove-duplicate-lines';
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

export default function RemoveDuplicateLinesPage() {
  return (
    <ToolLayout slug={slug}>
      <RemoveDuplicateLines />
    </ToolLayout>
  );
}
