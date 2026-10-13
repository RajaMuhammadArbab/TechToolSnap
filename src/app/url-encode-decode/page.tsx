import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import UrlEncodeDecode from '@/components/tools/UrlEncodeDecode';
import { getToolBySlug } from '@/tools.config';

const slug = 'url-encode-decode';
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

export default function UrlEncodeDecodePage() {
  return (
    <ToolLayout slug={slug}>
      <UrlEncodeDecode />
    </ToolLayout>
  );
}
