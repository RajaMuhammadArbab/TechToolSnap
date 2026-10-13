import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import CharacterCounter from '@/components/tools/CharacterCounter';
import { getToolBySlug } from '@/tools.config';

const slug = 'character-counter';
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

export default function CharacterCounterPage() {
  return (
    <ToolLayout slug={slug}>
      <CharacterCounter />
    </ToolLayout>
  );
}
