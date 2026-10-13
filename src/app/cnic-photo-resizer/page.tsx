import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import CnicPhotoResizer from '@/components/tools/CnicPhotoResizer';
import { getToolBySlug } from '@/tools.config';

const slug = 'cnic-photo-resizer';
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

export default function CnicPhotoResizerPage() {
  return (
    <ToolLayout slug={slug}>
      <CnicPhotoResizer />
    </ToolLayout>
  );
}
