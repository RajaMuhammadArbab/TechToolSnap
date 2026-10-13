'use client';
import { useState } from 'react';
import ToolCard from '@/components/ToolCard';
import { ToolConfig } from '@/tools.config';
import { 
  Sparkles, 
  Layers, 
  Image as ImageIcon, 
  FileText, 
  Calculator, 
  Type, 
  Flag,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface BentoGridProps {
  allTools: ToolConfig[];
}

type TabType = 'All' | 'Image' | 'PDF' | 'Calculators' | 'Text' | 'Developer Tools' | 'Pakistan';

export default function BentoToolGrid({ allTools }: BentoGridProps) {
  const [activeTab, setActiveTab] = useState<TabType>('All');

  const pakistanSlugs = ['cnic-photo-resizer', 'passport-size-photo-maker', 'zakat-calculator'];

  const filteredTools = allTools.filter(tool => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Pakistan') return pakistanSlugs.includes(tool.slug);
    return tool.category === activeTab;
  });

  const tabs: { key: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'All', label: 'All Tools', icon: Layers },
    { key: 'Developer Tools', label: 'Dev Tools', icon: Sparkles },
    { key: 'Image', label: 'Image Tools', icon: ImageIcon },
    { key: 'PDF', label: 'PDF Tools', icon: FileText },
    { key: 'Calculators', label: 'Calculators', icon: Calculator },
    { key: 'Text', label: 'Text & Security', icon: Type },
    { key: 'Pakistan', label: 'Pakistan Tools', icon: Flag },
  ];

  return (
    <div className="space-y-8">
      {/* Category Tabs Filter */}
      <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 scrollbar-none gap-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? 'bg-[#111827] text-white border-[#111827] dark:bg-[#F5B301] dark:text-[#111827] dark:border-[#F5B301] shadow-xs'
                  : 'bg-white dark:bg-[#171A23] text-slate-700 dark:text-slate-300 border-[#EAE6DF] dark:border-[#262B38] hover:border-[#DCD6CA] hover:bg-[#FAF8F5] dark:hover:bg-[#1E2330]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                isActive 
                  ? 'bg-white/20 dark:bg-black/20 text-current' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {tab.key === 'All' 
                  ? allTools.length 
                  : tab.key === 'Pakistan' 
                    ? pakistanSlugs.length 
                    : allTools.filter(t => t.category === tab.key).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filteredTools.map(tool => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      {/* Category Suite Direct Links Footer */}
      <div className="pt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
        <span>Deep Dives:</span>
        <Link href="/developer-tools" className="hover:text-[#D97706] dark:hover:text-[#F5B301] underline underline-offset-4 text-indigo-600 dark:text-indigo-400">Dev Suite ({allTools.filter(t=>t.category==='Developer Tools').length})</Link>
        <span>·</span>
        <Link href="/image-tools" className="hover:text-[#D97706] dark:hover:text-[#F5B301] underline underline-offset-4">Image Suite ({allTools.filter(t=>t.category==='Image').length})</Link>
        <span>·</span>
        <Link href="/pdf-tools" className="hover:text-[#D97706] dark:hover:text-[#F5B301] underline underline-offset-4">PDF Suite ({allTools.filter(t=>t.category==='PDF').length})</Link>
        <span>·</span>
        <Link href="/calculators" className="hover:text-[#D97706] dark:hover:text-[#F5B301] underline underline-offset-4">Calculators ({allTools.filter(t=>t.category==='Calculators').length})</Link>
        <span>·</span>
        <Link href="/text-tools" className="hover:text-[#D97706] dark:hover:text-[#F5B301] underline underline-offset-4">Text Suite ({allTools.filter(t=>t.category==='Text').length})</Link>
      </div>
    </div>
  );
}
