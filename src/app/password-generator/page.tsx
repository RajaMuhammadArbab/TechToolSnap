import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import PasswordGenerator from '@/components/tools/PasswordGenerator';
import { getToolBySlug } from '@/tools.config';

const slug = 'password-generator';
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

export default function PasswordGeneratorPage() {
  return (
    <ToolLayout slug={slug}>
      <PasswordGenerator />
    </ToolLayout>
  );
}
