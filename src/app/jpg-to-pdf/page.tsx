import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import JpgToPdf from '@/components/tools/JpgToPdf';
import { getToolBySlug } from '@/tools.config';

const slug = 'jpg-to-pdf';
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

export default function JpgToPdfPage() {
  return (
    <ToolLayout slug={slug}>
      <JpgToPdf />
    </ToolLayout>
  );
}
