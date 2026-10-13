'use client';
import { useState } from 'react';
import { Copy, Check, Download, AlertCircle, ArrowRight } from 'lucide-react';

export default function JsonToCsv() {
  const [jsonInput, setJsonInput] = useState(`[
  { "id": 101, "name": "Ali Khan", "role": "Senior Engineer", "city": "Karachi", "active": true },
  { "id": 102, "name": "Sara Ahmed", "role": "Product Lead", "city": "Lahore", "active": true },
  { "id": 103, "name": "Usman Tariq", "role": "Security Specialist", "city": "Islamabad", "active": false }
]`);
  const [csvOutput, setCsvOutput] = useState('');
  const [delimiter, setDelimiter] = useState<',' | ';' | '\t'>(',');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const convertToCsv = () => {
    if (!jsonInput.trim()) {
      setError('Please provide JSON data first.');
      setCsvOutput('');
      return;
    }

    try {
      let data = JSON.parse(jsonInput);
      if (!Array.isArray(data)) {
        if (typeof data === 'object' && data !== null) {
          // If single object, wrap in array
          data = [data];
        } else {
          throw new Error('Root JSON element must be an array of objects.');
        }
      }

      if (data.length === 0) {
        setCsvOutput('');
        setError('JSON array is empty.');
        return;
      }

      // Collect all unique keys across all objects
      const headersSet = new Set<string>();
      data.forEach((item: any) => {
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach((k) => headersSet.add(k));
        }
      });
      const headers = Array.from(headersSet);

      // Escape CSV values
      const escapeVal = (val: any): string => {
        if (val === null || val === undefined) return '';
        if (typeof val === 'object') {
          return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
        }
        const str = String(val);
        if (str.includes(delimiter) || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      const rows: string[] = [];
      // Header row
      rows.push(headers.map(escapeVal).join(delimiter));

      // Data rows
      data.forEach((item: any) => {
        if (typeof item === 'object' && item !== null) {
          const row = headers.map((h) => escapeVal(item[h]));
          rows.push(row.join(delimiter));
        }
      });

      setCsvOutput(rows.join('\n'));
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Failed to parse JSON.');
      setCsvOutput('');
    }
  };

  const handleCopy = () => {
    if (!csvOutput) return;
    navigator.clipboard.writeText(csvOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCsv = () => {
    if (!csvOutput) return;
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted_data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#11141C] border border-[#EAE6DF] dark:border-[#202532]">
        <div className="flex items-center gap-3">
          <button
            onClick={convertToCsv}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#111827] text-white dark:bg-[#F5B301] dark:text-[#111827] flex items-center gap-1.5 hover:opacity-90"
          >
            <span>Convert to CSV</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 pl-2">
            <span>Delimiter:</span>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value as any)}
              className="px-2 py-1.5 rounded-lg border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] text-xs font-bold"
            >
              <option value=",">Comma (,)</option>
              <option value=";">Semicolon (;)</option>
              <option value="&#9;">Tab (\t)</option>
            </select>
          </div>
        </div>

        {csvOutput && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="text-xs font-semibold text-[#D97706] dark:text-[#F5B301] hover:underline flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy CSV'}</span>
            </button>
            <button
              onClick={downloadCsv}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-[#171A23] border border-[#EAE6DF] dark:border-[#262B38] text-slate-700 dark:text-slate-300 hover:border-[#F5B301] flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .csv</span>
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 text-xs sm:text-sm font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Editor & Viewer Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            <span>Input JSON Array</span>
            <span>{jsonInput.length} chars</span>
          </div>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste JSON array of objects here..."
            className="w-full h-80 p-4 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] font-mono text-xs sm:text-sm text-[#111827] dark:text-[#F3F4F6] focus:outline-none focus:border-[#F5B301] resize-none"
            spellCheck={false}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            <span>Output CSV</span>
            <span>{csvOutput ? `${csvOutput.split('\n').length} rows` : '0 rows'}</span>
          </div>
          <textarea
            readOnly
            value={csvOutput}
            placeholder="CSV table rows will appear here..."
            className="w-full h-80 p-4 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-[#FAF8F5]/80 dark:bg-[#11141C] font-mono text-xs sm:text-sm text-[#111827] dark:text-[#F3F4F6] focus:outline-none resize-none"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
