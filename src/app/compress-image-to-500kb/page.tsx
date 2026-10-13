import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import ImageCompressor from '@/components/tools/ImageCompressor';
import { getToolBySlug } from '@/tools.config';

const slug = 'compress-image-to-500kb';
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

export default function CompressImage500KB() {
  return (
    <ToolLayout slug={slug}>
      <ImageCompressor targetSizeKB={500} />
    </ToolLayout>
  );
}
