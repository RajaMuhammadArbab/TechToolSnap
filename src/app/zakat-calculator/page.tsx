import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import ZakatCalculator from '@/components/tools/ZakatCalculator';
import { getToolBySlug } from '@/tools.config';

const slug = 'zakat-calculator';
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

export default function ZakatCalculatorPage() {
  return (
    <ToolLayout slug={slug}>
      <ZakatCalculator />
    </ToolLayout>
  );
}
