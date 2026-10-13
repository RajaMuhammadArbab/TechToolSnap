import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import RegexTester from '@/components/tools/RegexTester';
import { getToolBySlug } from '@/tools.config';

const slug = 'regex-tester';
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

export default function RegexTesterPage() {
  return (
    <ToolLayout slug={slug}>
      <RegexTester />
    </ToolLayout>
  );
}
