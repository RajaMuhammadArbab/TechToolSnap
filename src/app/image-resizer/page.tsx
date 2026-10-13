import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import ImageResizer from '@/components/tools/ImageResizer';
import { getToolBySlug } from '@/tools.config';

const slug = 'image-resizer';
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

export default function ImageResizerPage() {
  return (
    <ToolLayout slug={slug}>
      <ImageResizer />
    </ToolLayout>
  );
}
