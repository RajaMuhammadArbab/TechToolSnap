import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import KeyboardTester from '@/components/tools/KeyboardTester';
import { getToolBySlug } from '@/tools.config';

const slug = 'keyboard-tester';
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

export default function KeyboardTesterPage() {
  return (
    <ToolLayout slug={slug}>
      <KeyboardTester />
    </ToolLayout>
  );
}
