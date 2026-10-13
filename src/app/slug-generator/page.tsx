import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import SlugGenerator from '@/components/tools/SlugGenerator';
import { getToolBySlug } from '@/tools.config';

const slug = 'slug-generator';
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

export default function SlugGeneratorPage() {
  return (
    <ToolLayout slug={slug}>
      <SlugGenerator />
    </ToolLayout>
  );
}
