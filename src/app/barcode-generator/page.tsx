import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import BarcodeGenerator from '@/components/tools/BarcodeGenerator';
import { getToolBySlug } from '@/tools.config';

const slug = 'barcode-generator';
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

export default function BarcodePage() {
  return (
    <ToolLayout slug={slug}>
      <BarcodeGenerator />
    </ToolLayout>
  );
}
