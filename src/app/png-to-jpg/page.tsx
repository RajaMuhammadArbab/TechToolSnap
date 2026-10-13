import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import PngToJpg from '@/components/tools/PngToJpg';
import { getToolBySlug } from '@/tools.config';

const slug = 'png-to-jpg';
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

export default function PngToJpgPage() {
  return (
    <ToolLayout slug={slug}>
      <PngToJpg />
    </ToolLayout>
  );
}
