'use client';
import { useEffect } from 'react';
import { recordRecentTool } from '@/lib/userTools';

export default function RecentTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (slug) {
      recordRecentTool(slug);
    }
  }, [slug]);

  return null;
}
