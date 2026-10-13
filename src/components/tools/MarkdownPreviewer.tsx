'use client';
import { useState, useMemo } from 'react';
import { Copy, Check, Download, Eye, Code } from 'lucide-react';

export default function MarkdownPreviewer() {
  const [markdown, setMarkdown] = useState(`# Welcome to Markdown Previewer

TechToolSnap provides **fast**, **private**, and **client-side** developer utilities.

## Features List
- Real-time live HTML rendering
- Clean typography and code styling
- Single-click HTML output export
- Zero cloud uploads or tracking

### Code Example
\`\`\`javascript
const greeting = "Hello, TechToolSnap!";
console.log(greeting);
\`\`\`

> "Good design is as little design as possible." — Dieter Rams

Link: [Explore Developer Tools](/developer-tools)
`);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'html'>('preview');

  // Simple, safe client-side Markdown to HTML converter
  const renderedHtml = useMemo(() => {
    let raw = markdown;

    // Escape basic HTML
    raw = raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Fenced code blocks
    raw = raw.replace(/```([a-zA-Z0-9]*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre class="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto my-4"><code>${code.trim()}</code></pre>`;
    });

    // Inline code
    raw = raw.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-xs text-amber-600 dark:text-amber-400">$1</code>');

    // Headings
    raw = raw.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2 text-[#111827] dark:text-white">$1</h3>');
    raw = raw.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-5 mb-2 text-[#111827] dark:text-white pb-1 border-b border-slate-200 dark:border-slate-800">$1</h2>');
    raw = raw.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold mt-6 mb-3 text-[#111827] dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800">$1</h1>');

    // Blockquote
    raw = raw.replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-[#F5B301] pl-4 py-1 italic my-3 text-slate-600 dark:text-slate-400 bg-amber-50/40 dark:bg-amber-950/20 rounded-r">$1</blockquote>');

    // Bold & Italic
    raw = raw.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    raw = raw.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Links [text](url)
    raw = raw.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-amber-600 dark:text-[#F5B301] hover:underline font-semibold" target="_blank" rel="noopener noreferrer">$1</a>');

    // Unordered lists
    raw = raw.replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc text-sm my-1">$1</li>');

    // Paragraphs
    const paragraphs = raw.split(/\n\s*\n/);
    return paragraphs
      .map((p) => {
        const trimmed = p.trim();
        if (trimmed.startsWith('<h') || trimmed.startsWith('<pre') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<li')) {
          return trimmed;
        }
        return `<p class="my-2 leading-relaxed text-sm sm:text-base text-slate-700 dark:text-slate-300">${trimmed.replace(/\n/g, '<br/>')}</p>`;
      })
      .join('\n');
  }, [markdown]);

  const copyHtml = () => {
    navigator.clipboard.writeText(renderedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMd = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#11141C] border border-[#EAE6DF] dark:border-[#202532]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'preview'
                ? 'bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827] shadow-xs'
                : 'bg-white dark:bg-[#171A23] text-slate-700 dark:text-slate-300 border border-[#EAE6DF] dark:border-[#262B38]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Visual Preview</span>
          </button>
          <button
            onClick={() => setActiveTab('html')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'html'
                ? 'bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827] shadow-xs'
                : 'bg-white dark:bg-[#171A23] text-slate-700 dark:text-slate-300 border border-[#EAE6DF] dark:border-[#262B38]'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Raw HTML</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={copyHtml}
            className="px-3 py-1.5 text-xs font-semibold text-[#D97706] dark:text-[#F5B301] hover:underline flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'HTML Copied' : 'Copy HTML'}</span>
          </button>
          <button
            onClick={downloadMd}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .md</span>
          </button>
        </div>
      </div>

      {/* Editor & Viewer Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Markdown Source */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            <span>Markdown Source</span>
            <span>{markdown.length} chars</span>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Type markdown here..."
            className="w-full h-96 p-4 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] font-mono text-xs sm:text-sm text-[#111827] dark:text-[#F3F4F6] focus:outline-none focus:border-[#F5B301] resize-none"
            spellCheck={false}
          />
        </div>

        {/* Live Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            <span>{activeTab === 'preview' ? 'Live Formatted Preview' : 'Raw HTML Code'}</span>
          </div>
          {activeTab === 'preview' ? (
            <div
              className="w-full h-96 p-6 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-[#FAF8F5]/80 dark:bg-[#11141C] overflow-auto prose dark:prose-invert max-w-none text-[#111827] dark:text-[#F3F4F6]"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          ) : (
            <textarea
              readOnly
              value={renderedHtml}
              className="w-full h-96 p-4 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-[#FAF8F5]/80 dark:bg-[#11141C] font-mono text-xs text-[#111827] dark:text-[#F3F4F6] focus:outline-none resize-none"
              spellCheck={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}
