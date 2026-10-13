'use client';

const RECENT_KEY = 'qth_recent_tools';
const FAVORITES_KEY = 'qth_favorite_tools';

export function getRecentTools(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordRecentTool(slug: string) {
  if (typeof window === 'undefined') return;
  try {
    const current = getRecentTools().filter(s => s !== slug);
    const updated = [slug, ...current].slice(0, 8); // Keep last 8
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving recent tool', e);
  }
}

export function getFavoriteTools(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavoriteTool(slug: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const current = getFavoriteTools();
    let updated: string[];
    let isFav = false;
    if (current.includes(slug)) {
      updated = current.filter(s => s !== slug);
      isFav = false;
    } else {
      updated = [...current, slug];
      isFav = true;
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return isFav;
  } catch {
    return false;
  }
}
