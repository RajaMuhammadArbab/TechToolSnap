import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import Base64Tool from '@/components/tools/Base64Tool';
import { getToolBySlug } from '@/tools.config';

const slug = 'base64-encode-decode';
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

export default function Base64Page() {
  return (
    <ToolLayout slug={slug}>
      <Base64Tool />
    </ToolLayout>
  );
}
