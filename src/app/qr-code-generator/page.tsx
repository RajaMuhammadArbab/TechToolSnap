import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import QrCodeGenerator from '@/components/tools/QrCodeGenerator';
import { getToolBySlug } from '@/tools.config';

const slug = 'qr-code-generator';
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

export default function QrCodeGeneratorPage() {
  return (
    <ToolLayout slug={slug}>
      <QrCodeGenerator />
    </ToolLayout>
  );
}
