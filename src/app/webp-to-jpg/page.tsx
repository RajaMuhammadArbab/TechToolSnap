import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import WebpToJpg from '@/components/tools/WebpToJpg';
import { getToolBySlug } from '@/tools.config';

const slug = 'webp-to-jpg';
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

export default function WebpToJpgPage() {
  return (
    <ToolLayout slug={slug}>
      <WebpToJpg />
    </ToolLayout>
  );
}
