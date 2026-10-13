import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import AgeCalculator from '@/components/tools/AgeCalculator';
import { getToolBySlug } from '@/tools.config';

const slug = 'age-calculator';
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

export default function AgeCalculatorPage() {
  return (
    <ToolLayout slug={slug}>
      <AgeCalculator />
    </ToolLayout>
  );
}
