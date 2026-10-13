'use client';
import { useState } from 'react';
import { FileText, ArrowUp, ArrowDown, Trash2, Plus, Download, CheckCircle2 } from 'lucide-react';

interface PdfFileItem {
  id: string;
  file: File;
  pageCount?: number;
}

export default function PdfMerge() {
  const [files, setFiles] = useState<PdfFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles: PdfFileItem[] = Array.from(e.target.files)
      .filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'))
      .map(file => ({
        id: Math.random().toString(36).substring(7),
        file
      }));
    setFiles(prev => [...prev, ...newFiles]);
    setMergedBlob(null);
    setError(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setFiles(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    setFiles(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy;
    });
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please add at least 2 PDF files to merge.');
      return;
    }
    setIsProcessing(true);
    setError(null);

    try {
      const { PDFDocument } = await import('pdf-lib');
      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const fileBuffer = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes as unknown as Uint8Array<ArrayBuffer>], { type: 'application/pdf' });
      setMergedBlob(blob);
    } catch (err) {
      console.error(err);
      setError('Failed to merge PDFs. Please verify that files are valid and not password protected.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadMerged = () => {
    if (!mergedBlob) return;
    const url = URL.createObjectURL(mergedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merged_${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* Upload button area */}
      <div 
        className="border-2 border-dashed border-indigo-300 dark:border-indigo-700 hover:border-indigo-500 rounded-2xl p-8 text-center bg-indigo-50/40 dark:bg-slate-800/40 cursor-pointer transition-colors"
        onClick={() => document.getElementById('pdf-merge-input')?.click()}
      >
        <input 
          id="pdf-merge-input"
          type="file" 
          accept="application/pdf"
          multiple 
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
          <Plus className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">
          Select or Drop PDF Files
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Upload 2 or more PDFs. You can reorder them before merging.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Selected files list */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300 px-1">
            <span>{files.length} Files Selected (Arrange in desired order)</span>
            <button 
              onClick={() => setFiles([])} 
              className="text-red-500 hover:text-red-600 text-xs font-semibold"
            >
              Clear All
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/60 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 overflow-hidden">
            {files.map((item, idx) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800">
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <div className="truncate">
                    <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                      {item.file.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatSize(item.file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button 
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    title="Move up"
                    aria-label="Move up"
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
                  >
                    <ArrowUp className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  </button>
                  <button 
                    onClick={() => moveDown(idx)}
                    disabled={idx === files.length - 1}
                    title="Move down"
                    aria-label="Move down"
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
                  >
                    <ArrowDown className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  </button>
                  <button 
                    onClick={() => removeFile(item.id)}
                    title="Remove file"
                    aria-label="Remove file"
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!mergedBlob && (
            <div className="pt-2">
              <button
                onClick={handleMerge}
                disabled={isProcessing || files.length < 2}
                className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-500 hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Merging PDFs locally...</span>
                  </>
                ) : (
                  <span>Merge {files.length} PDFs Now</span>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Merged Success State */}
      {mergedBlob && (
        <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-center space-y-4">
          <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            PDFs Merged Successfully!
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Combined {files.length} documents into one single PDF without uploading any data.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={downloadMerged}
              className="py-3 px-8 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Merged PDF
            </button>
            <button
              onClick={() => {
                setFiles([]);
                setMergedBlob(null);
              }}
              className="py-3 px-6 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
            >
              Merge More Files
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
