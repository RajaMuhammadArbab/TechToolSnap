import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import MarkdownPreviewer from '@/components/tools/MarkdownPreviewer';
import { getToolBySlug } from '@/tools.config';

const slug = 'markdown-previewer';
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

export default function MarkdownPreviewerPage() {
  return (
    <ToolLayout slug={slug}>
      <MarkdownPreviewer />
    </ToolLayout>
  );
}
