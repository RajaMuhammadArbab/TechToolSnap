import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import TextCaseConverter from '@/components/tools/TextCaseConverter';
import { getToolBySlug } from '@/tools.config';

const slug = 'text-case-converter';
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

export default function TextCaseConverterPage() {
  return (
    <ToolLayout slug={slug}>
      <TextCaseConverter />
    </ToolLayout>
  );
}
