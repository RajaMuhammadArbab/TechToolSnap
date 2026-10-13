import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import FindAndReplaceText from '@/components/tools/FindAndReplaceText';
import { getToolBySlug } from '@/tools.config';

const slug = 'find-and-replace-text';
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

export default function FindAndReplaceTextPage() {
  return (
    <ToolLayout slug={slug}>
      <FindAndReplaceText />
    </ToolLayout>
  );
}
