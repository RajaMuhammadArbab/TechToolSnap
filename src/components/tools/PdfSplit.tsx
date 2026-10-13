'use client';
import { useState } from 'react';
import FileDropzone from '../FileDropzone';
import { FileText, Download, CheckCircle2, Scissors } from 'lucide-react';

export default function PdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageRange, setPageRange] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadBlob, setDownloadBlob] = useState<Blob | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a valid PDF document.');
      return;
    }
    setError(null);
    setFile(selectedFile);
    setDownloadBlob(null);
    setIsProcessing(true);

    try {
      const { PDFDocument } = await import('pdf-lib');
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const count = pdf.getPageCount();
      setTotalPages(count);
      setPageRange(`1-${Math.min(count, 3)}`);
    } catch (err) {
      console.error(err);
      setError('Unable to read PDF. It might be encrypted or corrupted.');
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const parseRanges = (input: string, max: number): number[] => {
    const pages = new Set<number>();
    const parts = input.split(',').map(s => s.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-').map(s => s.trim());
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const lower = Math.max(1, Math.min(start, end));
          const upper = Math.min(max, Math.max(start, end));
          for (let p = lower; p <= upper; p++) {
            pages.add(p);
          }
        }
      } else {
        const p = parseInt(part, 10);
        if (!isNaN(p) && p >= 1 && p <= max) {
          pages.add(p);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleExtractPages = async () => {
    if (!file || totalPages === 0) return;
    const pagesToExtract = parseRanges(pageRange, totalPages);

    if (pagesToExtract.length === 0) {
      setError(`Please specify valid pages between 1 and ${totalPages}. (e.g. "1-3, 5")`);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { PDFDocument } = await import('pdf-lib');
      const arrayBuffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer);
      const newDoc = await PDFDocument.create();

      // Zero-indexed page indices
      const indices = pagesToExtract.map(p => p - 1);
      const copiedPages = await newDoc.copyPages(srcDoc, indices);
      copiedPages.forEach(page => newDoc.addPage(page));

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes as unknown as Uint8Array<ArrayBuffer>], { type: 'application/pdf' });
      setDownloadBlob(blob);
      setDownloadFilename(`split_pages_${pagesToExtract.join('_')}_${file.name}`);
    } catch (err) {
      console.error(err);
      setError('Failed to extract pages from PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = () => {
    if (!downloadBlob) return;
    const url = URL.createObjectURL(downloadBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <FileDropzone 
          onFileSelect={handleFileSelect} 
          accept="application/pdf"
          label="Upload PDF to Split" 
          sublabel="Extract specific pages or page ranges instantly"
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-grow min-w-0">
              <h3 className="font-semibold text-slate-800 dark:text-white truncate">
                {file.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total Pages: <span className="font-bold text-indigo-600 dark:text-indigo-400">{totalPages}</span>
              </p>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setDownloadBlob(null);
              }}
              className="text-sm text-slate-500 hover:text-red-500 font-medium"
            >
              Change File
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h4 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <Scissors className="w-4 h-4 text-indigo-500" />
              Specify Pages to Extract
            </h4>
            <div className="space-y-2">
              <label className="block text-sm text-slate-600 dark:text-slate-300">
                Page numbers or range (e.g. <span className="font-mono text-indigo-600 font-semibold">1-3</span> or <span className="font-mono text-indigo-600 font-semibold">1, 4, 7-9</span>)
              </label>
              <input 
                type="text" 
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                placeholder={`1-${totalPages}`}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <p className="text-xs text-slate-400">
              Enter individual pages separated by commas, or ranges with hyphens. Max page: {totalPages}.
            </p>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                {error}
              </div>
            )}

            {!downloadBlob && (
              <button
                onClick={handleExtractPages}
                disabled={isProcessing}
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Processing in browser...' : 'Split and Extract Pages'}
              </button>
            )}
          </div>

          {downloadBlob && (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Pages Extracted Successfully!
              </h3>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={downloadFile}
                  className="py-3 px-8 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Extracted PDF
                </button>
                <button
                  onClick={() => setDownloadBlob(null)}
                  className="py-3 px-6 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
                >
                  Extract Other Pages
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
