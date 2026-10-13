import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import JwtDecoder from '@/components/tools/JwtDecoder';
import { getToolBySlug } from '@/tools.config';

const slug = 'jwt-decoder';
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

export default function JwtDecoderPage() {
  return (
    <ToolLayout slug={slug}>
      <JwtDecoder />
    </ToolLayout>
  );
}
