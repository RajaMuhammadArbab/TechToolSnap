import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import ReverseText from '@/components/tools/ReverseText';
import { getToolBySlug } from '@/tools.config';

const slug = 'reverse-text';
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

export default function ReverseTextPage() {
  return (
    <ToolLayout slug={slug}>
      <ReverseText />
    </ToolLayout>
  );
}
