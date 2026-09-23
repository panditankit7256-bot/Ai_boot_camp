import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-slate-500">
      <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      <p className="mt-3 text-sm">{label}</p>
    </div>
  );
}
