import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import PercentageCalculator from '@/components/tools/PercentageCalculator';
import { getToolBySlug } from '@/tools.config';

const slug = 'percentage-calculator';
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

export default function PercentageCalculatorPage() {
  return (
    <ToolLayout slug={slug}>
      <PercentageCalculator />
    </ToolLayout>
  );
}
