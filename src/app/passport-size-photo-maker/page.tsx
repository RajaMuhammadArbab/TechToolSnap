import { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import PassportPhotoMaker from '@/components/tools/PassportPhotoMaker';
import { getToolBySlug } from '@/tools.config';

const slug = 'passport-size-photo-maker';
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

export default function PassportPhotoMakerPage() {
  return (
    <ToolLayout slug={slug}>
      <PassportPhotoMaker />
    </ToolLayout>
  );
}
