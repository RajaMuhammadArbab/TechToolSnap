import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import TextDiffChecker from '@/components/tools/TextDiffChecker';
import { getToolBySlug } from '@/tools.config';

const slug = 'text-diff-checker';
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

export default function TextDiffCheckerPage() {
  return (
    <ToolLayout slug={slug}>
      <TextDiffChecker />
    </ToolLayout>
  );
}
