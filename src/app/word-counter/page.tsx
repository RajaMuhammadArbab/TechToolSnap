import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import WordCounter from '@/components/tools/WordCounter';
import { getToolBySlug } from '@/tools.config';

const slug = 'word-counter';
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

export default function WordCounterPage() {
  return (
    <ToolLayout slug={slug}>
      <WordCounter />
    </ToolLayout>
  );
}
