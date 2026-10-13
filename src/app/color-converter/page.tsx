import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import ColorConverter from '@/components/tools/ColorConverter';
import { getToolBySlug } from '@/tools.config';

const slug = 'color-converter';
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

export default function ColorConverterPage() {
  return (
    <ToolLayout slug={slug}>
      <ColorConverter />
    </ToolLayout>
  );
}
