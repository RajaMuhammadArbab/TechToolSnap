import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import GpaCalculator from '@/components/tools/GpaCalculator';
import { getToolBySlug } from '@/tools.config';

const slug = 'gpa-calculator';
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

export default function GpaCalculatorPage() {
  return (
    <ToolLayout slug={slug}>
      <GpaCalculator />
    </ToolLayout>
  );
}
