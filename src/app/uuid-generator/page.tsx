import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import UuidGenerator from '@/components/tools/UuidGenerator';
import { getToolBySlug } from '@/tools.config';

const slug = 'uuid-generator';
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

export default function UuidGeneratorPage() {
  return (
    <ToolLayout slug={slug}>
      <UuidGenerator />
    </ToolLayout>
  );
}
