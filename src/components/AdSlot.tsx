export default function AdSlot({ id, className = '' }: { id: string; className?: string }) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div
      id={id}
      className={`w-full min-h-[90px] rounded-xl ${isDev ? 'bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center' : ''} ${className}`}
      aria-hidden="true"
    >
      {isDev && (
        <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">Ad Slot · {id}</span>
      )}
    </div>
  );
}
