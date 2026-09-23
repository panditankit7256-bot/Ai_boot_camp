import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <div className="flex items-center gap-2 text-red-600">
        <AlertCircle className="w-6 h-6" />
        <p className="text-sm font-medium">{message || 'Something went wrong'}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary mt-4">
          Try Again
        </button>
      )}
    </div>
  );
}
