import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import TimestampConverter from '@/components/tools/TimestampConverter';
import { getToolBySlug } from '@/tools.config';

const slug = 'timestamp-converter';
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

export default function TimestampConverterPage() {
  return (
    <ToolLayout slug={slug}>
      <TimestampConverter />
    </ToolLayout>
  );
}
