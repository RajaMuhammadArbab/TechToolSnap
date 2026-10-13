import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import LoremIpsumGenerator from '@/components/tools/LoremIpsumGenerator';
import { getToolBySlug } from '@/tools.config';

const slug = 'lorem-ipsum-generator';
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

export default function LoremIpsumGeneratorPage() {
  return (
    <ToolLayout slug={slug}>
      <LoremIpsumGenerator />
    </ToolLayout>
  );
}
