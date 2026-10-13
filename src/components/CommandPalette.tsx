'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Star, Clock, X, ArrowRight, Sparkles } from 'lucide-react';
import { tools, ToolConfig } from '@/tools.config';
import { getRecentTools, getFavoriteTools, toggleFavoriteTool, recordRecentTool } from '@/lib/userTools';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFavorites(getFavoriteTools());
      setRecents(getRecentTools());
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle global shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filtered tools
  const filteredTools = query.trim()
    ? tools.filter(t => 
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase()) ||
        t.keywords.some(k => k.toLowerCase().includes(query.toLowerCase())) ||
        t.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const favoriteTools = tools.filter(t => favorites.includes(t.slug));
  const recentTools = recents
    .map(slug => tools.find(t => t.slug === slug))
    .filter((t): t is ToolConfig => t !== undefined);

  const displayList = query.trim() ? filteredTools : (favoriteTools.length > 0 ? favoriteTools : recentTools.slice(0, 5));

  const handleSelect = (slug: string) => {
    recordRecentTool(slug);
    onClose();
    router.push(`/${slug}`);
  };

  const handleToggleFav = (e: React.MouseEvent, slug: string) => {
    e.stopPropagation();
    toggleFavoriteTool(slug);
    setFavorites(getFavoriteTools());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header */}
        <div className="flex items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a tool name, category, or task... (e.g. compress, pdf, gpa)"
            className="w-full text-base sm:text-lg bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto p-4 space-y-4">
          {query.trim() === '' && (
            <>
              {/* Favorites Section */}
              {favoriteTools.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-amber-500 uppercase tracking-wider">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>Your Favorites</span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {favoriteTools.map((tool) => (
                      <div
                        key={tool.slug}
                        onClick={() => handleSelect(tool.slug)}
                        className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/70 cursor-pointer group transition-colors"
                      >
                        <div className="min-w-0 pr-3">
                          <h4 className="font-semibold text-sm text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                            {tool.title}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-1">{tool.description}</p>
                        </div>
                        <button
                          onClick={(e) => handleToggleFav(e, tool.slug)}
                          className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                          title="Remove from favorites"
                        >
                          <Star className="w-4 h-4 fill-amber-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recently Used Section */}
              {recentTools.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-indigo-500 uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Recently Used Tools</span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {recentTools.map((tool) => (
                      <div
                        key={tool.slug}
                        onClick={() => handleSelect(tool.slug)}
                        className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/70 cursor-pointer group transition-colors"
                      >
                        <div className="min-w-0 pr-3">
                          <h4 className="font-semibold text-sm text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                            {tool.title}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-1">{tool.description}</p>
                        </div>
                        <button
                          onClick={(e) => handleToggleFav(e, tool.slug)}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-amber-500"
                          title="Favorite tool"
                        >
                          <Star className={`w-4 h-4 ${favorites.includes(tool.slug) ? 'fill-amber-500 text-amber-500' : ''}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Browse categories quick jumps */}
              <div>
                <span className="block px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Browse by Category
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 px-1">
                  {[
                    { name: 'Image Tools', href: '/image-tools' },
                    { name: 'PDF Tools', href: '/pdf-tools' },
                    { name: 'Calculators', href: '/calculators' },
                    { name: 'Text Tools', href: '/text-tools' },
                  ].map((c) => (
                    <Link
                      key={c.name}
                      href={c.href}
                      onClick={onClose}
                      className="p-3 text-center rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Search Results */}
          {query.trim() !== '' && (
            <div>
              <span className="block px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                {filteredTools.length} Matching Tools
              </span>
              {filteredTools.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <p className="text-base font-medium">No tools found for &quot;{query}&quot;</p>
                  <p className="text-xs mt-1">Try searching for &quot;compress&quot;, &quot;pdf&quot;, &quot;photo&quot;, or &quot;calculate&quot;</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredTools.map((tool) => (
                    <div
                      key={tool.slug}
                      onClick={() => handleSelect(tool.slug)}
                      className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/70 cursor-pointer group transition-colors"
                    >
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                            {tool.title}
                          </h4>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                            {tool.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{tool.description}</p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={(e) => handleToggleFav(e, tool.slug)}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-amber-500 transition-colors"
                          title="Add to favorites"
                        >
                          <Star className={`w-4 h-4 ${favorites.includes(tool.slug) ? 'fill-amber-500 text-amber-500' : ''}`} />
                        </button>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-mono text-[10px]">ESC</kbd> to close</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-mono text-[10px]">Ctrl+K</kbd> anywhere</span>
          </div>
          <span>TechToolSnap</span>
        </div>
      </div>
    </div>
  );
}
