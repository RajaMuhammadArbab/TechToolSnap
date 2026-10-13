'use client';
import { useState } from 'react';
import FileDropzone from '../FileDropzone';
import { Loader2, FileText } from 'lucide-react';

export default function JpgToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleConvert = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    setFile(selectedFile);
    setIsProcessing(true);
    setError(null);
    setPdfBlob(null);

    try {
      const { PDFDocument } = await import('pdf-lib');
      const imageBytes = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.create();
      
      let image;
      if (selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/jpg') {
        image = await pdfDoc.embedJpg(imageBytes);
      } else if (selectedFile.type === 'image/png') {
        image = await pdfDoc.embedPng(imageBytes);
      } else {
        throw new Error('Unsupported image format. Please use JPG or PNG.');
      }

      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as Uint8Array<ArrayBuffer>], { type: 'application/pdf' });
      setPdfBlob(blob);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error converting to PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${file?.name.split('.')[0] || 'converted'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full">
      {!file && !isProcessing && !pdfBlob && (
        <FileDropzone onFileSelect={handleConvert} accept="image/*" label="Upload Image" sublabel="Drag and drop or browse to select" />
      )}

      {error && (
        <div className="mt-4 p-4 text-red-500 bg-red-50 rounded-xl text-center">
          {error}
          <button onClick={() => {setFile(null); setError(null);}} className="block mx-auto mt-2 text-sm underline font-medium">Try Again</button>
        </div>
      )}

      {isProcessing && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
          <p className="text-lg font-medium text-slate-700 dark:text-slate-300">Converting image to PDF...</p>
        </div>
      )}

      {pdfBlob && !isProcessing && (
        <div className="text-center py-8">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-500">
              <FileText className="w-12 h-12" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Conversion Successful!</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-8">{file?.name} • {formatBytes(pdfBlob.size)}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDownload}
              className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 px-8 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
            >
              Download PDF
            </button>
            <button
              onClick={() => { setFile(null); setPdfBlob(null); }}
              className="py-3 px-8 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Convert Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
