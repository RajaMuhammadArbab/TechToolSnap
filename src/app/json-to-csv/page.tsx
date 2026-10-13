import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import JsonToCsv from '@/components/tools/JsonToCsv';
import { getToolBySlug } from '@/tools.config';

const slug = 'json-to-csv';
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

export default function JsonToCsvPage() {
  return (
    <ToolLayout slug={slug}>
      <JsonToCsv />
    </ToolLayout>
  );
}
