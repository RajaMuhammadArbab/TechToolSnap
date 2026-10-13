'use client';
import { useState, useRef } from 'react';
import { UploadCloud, ShieldCheck } from 'lucide-react';

interface FileDropzoneProps {
  onFileSelect?: (file: File) => void;
  onFilesSelect?: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  label?: string;
  sublabel?: string;
}

export default function FileDropzone({
  onFileSelect,
  onFilesSelect,
  multiple = false,
  accept,
  label = 'Upload your file',
  sublabel = 'Drag and drop your file here, or click to browse',
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileList = Array.from(e.dataTransfer.files);
      if (onFilesSelect) {
        onFilesSelect(fileList);
      } else if (onFileSelect) {
        onFileSelect(fileList[0]);
      }
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = Array.from(e.target.files);
      if (onFilesSelect) {
        onFilesSelect(fileList);
      } else if (onFileSelect) {
        onFileSelect(fileList[0]);
      }
      e.target.value = ''; // Reset so same file can be re-selected if needed
    }
  };
  const handleClick = () => {
    inputRef.current?.click();
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full p-8 sm:p-12 rounded-3xl border-2 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center ${
          isDragging
            ? 'border-solid border-[#F5B301] bg-amber-50/80 dark:bg-amber-950/30 scale-[1.01]'
            : 'border-dashed border-[#DCD6CA] dark:border-[#2D3344] bg-[#FAF8F5]/60 dark:bg-[#11141C] hover:border-[#F5B301] hover:bg-white dark:hover:bg-[#171A23]'
        }`}
      >
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-200 ${
          isDragging 
            ? 'bg-[#F5B301] text-[#111827] scale-110 shadow-md' 
            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
        }`}>
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="font-extrabold text-lg sm:text-xl text-[#111827] dark:text-[#F3F4F6] mb-1.5">
          {label}
        </h3>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
          {sublabel}
        </p>

        <button
          type="button"
          className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#111827] text-white hover:bg-black dark:bg-[#F5B301] dark:text-[#111827] dark:hover:bg-[#E0A400] transition-colors shadow-2xs"
        >
          {multiple ? 'Select Multiple Files' : 'Browse File From Device'}
        </button>

        <input
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleChange}
          accept={accept}
          multiple={multiple}
        />
      </div>

      <div className="flex items-center gap-2 mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>100% Client-side · Files never leave your browser</span>
      </div>
    </div>
  );
}
