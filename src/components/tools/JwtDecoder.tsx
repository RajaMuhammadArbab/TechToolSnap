'use client';
import { useState } from 'react';
import { Copy, Check, ShieldCheck, AlertCircle, Key, Clock } from 'lucide-react';

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState<string>('');
  const [payload, setPayload] = useState<string>('');
  const [signature, setSignature] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copiedPart, setCopiedPart] = useState<string | null>(null);
  const [expInfo, setExpInfo] = useState<{ isExpired: boolean; dateString: string; relative: string } | null>(null);

  const base64UrlDecode = (str: string): string => {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw new Error('Illegal base64url string!');
    }
    const binary = atob(output);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  };

  const decodeJwt = (jwtString: string) => {
    const raw = jwtString.trim();
    if (!raw) {
      setHeader('');
      setPayload('');
      setSignature('');
      setError(null);
      setExpInfo(null);
      return;
    }

    const parts = raw.split('.');
    if (parts.length !== 3) {
      setError('Invalid JWT structure. A JSON Web Token must have exactly 3 parts separated by dots (header.payload.signature).');
      setHeader('');
      setPayload('');
      setSignature('');
      setExpInfo(null);
      return;
    }

    try {
      const decodedHeader = JSON.parse(base64UrlDecode(parts[0]));
      const decodedPayload = JSON.parse(base64UrlDecode(parts[1]));

      setHeader(JSON.stringify(decodedHeader, null, 2));
      setPayload(JSON.stringify(decodedPayload, null, 2));
      setSignature(parts[2]);
      setError(null);

      // Check expiration
      if (decodedPayload.exp && typeof decodedPayload.exp === 'number') {
        const expTime = decodedPayload.exp * 1000;
        const now = Date.now();
        const diffMs = expTime - now;
        const dateString = new Date(expTime).toLocaleString();
        const isExpired = diffMs < 0;

        const minutes = Math.abs(Math.round(diffMs / 60000));
        const hours = (Math.abs(diffMs) / 3600000).toFixed(1);
        const relative = isExpired
          ? `Expired ${minutes < 60 ? `${minutes}m` : `${hours}h`} ago`
          : `Valid for another ${minutes < 60 ? `${minutes}m` : `${hours}h`}`;

        setExpInfo({ isExpired, dateString, relative });
      } else {
        setExpInfo(null);
      }
    } catch (e: any) {
      setError(`Failed to decode JWT claims: ${e.message}`);
      setHeader('');
      setPayload('');
      setSignature('');
      setExpInfo(null);
    }
  };

  const handleCopy = (text: string, part: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPart(part);
    setTimeout(() => setCopiedPart(null), 1500);
  };

  const loadSample = () => {
    // Generate a valid sample JWT for demonstration
    const sample = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaSBLaGFuIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjI1MjQ2MDgwMDB9.4z7k_qY9V5pD3eE1wF2gH8iJ0kL2mN4oP6qR8sT0uVw';
    setToken(sample);
    decodeJwt(sample);
  };

  return (
    <div className="space-y-6">
      {/* Input Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          <span>Encoded Token (Paste Bearer or Raw JWT)</span>
          <button
            onClick={loadSample}
            className="text-xs font-semibold text-[#D97706] dark:text-[#F5B301] hover:underline"
          >
            Load Sample JWT
          </button>
        </div>
        <textarea
          value={token}
          onChange={(e) => {
            setToken(e.target.value);
            decodeJwt(e.target.value);
          }}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIi..."
          className="w-full h-32 p-4 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-white dark:bg-[#171A23] font-mono text-xs sm:text-sm text-[#111827] dark:text-[#F3F4F6] focus:outline-none focus:border-[#F5B301] resize-none"
          spellCheck={false}
        />
      </div>

      {/* Expiry Badge */}
      {expInfo && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold ${
          expInfo.isExpired
            ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400'
            : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300'
        }`}>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Expiration Claim (exp): {expInfo.dateString}</span>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs bg-white/70 dark:bg-black/40">
            {expInfo.relative}
          </span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 text-xs sm:text-sm font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Decoded Claims Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            <span className="text-violet-600 dark:text-violet-400">Header: Algorithm &amp; Token Type</span>
            {header && (
              <button
                onClick={() => handleCopy(header, 'header')}
                className="hover:underline flex items-center gap-1 text-slate-400"
              >
                {copiedPart === 'header' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPart === 'header' ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>
          <pre className="p-4 rounded-2xl border border-violet-200/70 dark:border-violet-900/40 bg-violet-50/50 dark:bg-violet-950/20 font-mono text-xs sm:text-sm text-[#111827] dark:text-[#F3F4F6] min-h-[160px] overflow-auto">
            {header || '// Header payload will appear here...'}
          </pre>
        </div>

        {/* Payload */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            <span className="text-rose-600 dark:text-rose-400">Payload: Claims Data</span>
            {payload && (
              <button
                onClick={() => handleCopy(payload, 'payload')}
                className="hover:underline flex items-center gap-1 text-slate-400"
              >
                {copiedPart === 'payload' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPart === 'payload' ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>
          <pre className="p-4 rounded-2xl border border-rose-200/70 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20 font-mono text-xs sm:text-sm text-[#111827] dark:text-[#F3F4F6] min-h-[160px] overflow-auto">
            {payload || '// Payload claims will appear here...'}
          </pre>
        </div>
      </div>

      {/* Signature info */}
      {signature && (
        <div className="p-4 rounded-2xl border border-[#EAE6DF] dark:border-[#262B38] bg-[#FAF8F5] dark:bg-[#11141C] space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            <span className="text-sky-600 dark:text-sky-400">Signature</span>
            <button
              onClick={() => handleCopy(signature, 'sig')}
              className="hover:underline flex items-center gap-1 text-slate-400"
            >
              {copiedPart === 'sig' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPart === 'sig' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="font-mono text-xs text-slate-500 break-all">{signature}</p>
        </div>
      )}

      {/* Privacy note */}
      <div className="flex items-center gap-2 p-3.5 rounded-xl bg-slate-100 dark:bg-[#171A23] text-xs text-slate-500 dark:text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Client-side security guarantee: Your JWT tokens, authorization headers, and secret claims are decoded in your browser memory and never transmitted anywhere.</span>
      </div>
    </div>
  );
}
