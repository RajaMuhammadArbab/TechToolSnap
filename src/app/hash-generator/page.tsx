import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import HashGenerator from '@/components/tools/HashGenerator';
import { getToolBySlug } from '@/tools.config';

const slug = 'hash-generator';
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

export default function HashGeneratorPage() {
  return (
    <ToolLayout slug={slug}>
      <HashGenerator />
    </ToolLayout>
  );
}
