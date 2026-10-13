import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import JpgToPng from '@/components/tools/JpgToPng';
import { getToolBySlug } from '@/tools.config';

const slug = 'jpg-to-png';
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

export default function JpgToPngPage() {
  return (
    <ToolLayout slug={slug}>
      <JpgToPng />
    </ToolLayout>
  );
}
