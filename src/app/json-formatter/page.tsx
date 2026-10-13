import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import JsonFormatter from '@/components/tools/JsonFormatter';
import { getToolBySlug } from '@/tools.config';

const slug = 'json-formatter';
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

export default function JsonFormatterPage() {
  return (
    <ToolLayout slug={slug}>
      <JsonFormatter />
    </ToolLayout>
  );
}
