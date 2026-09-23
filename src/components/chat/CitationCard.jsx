import { Link } from 'react-router-dom';
import { FileText, Hash, FileBox } from 'lucide-react';

export default function CitationCard({ citation }) {
  return (
    <div className="card p-3 text-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="inline-flex items-center gap-1.5 font-medium text-navy-700">
          <Hash className="w-3.5 h-3.5" />
          {citation.invoice_no}
        </span>
        <Link
          to={`/documents/${citation.document_id}`}
          className="text-xs text-brand-600 hover:text-brand-700 font-medium"
        >
          View Document →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-1 text-xs text-slate-600">
        <p><strong>Doc ID:</strong> {citation.document_id}</p>
        <p><strong>Page:</strong> {citation.page_number}</p>
        <p className="col-span-2"><strong>File:</strong> {citation.file_name}</p>
        <p className="col-span-2"><strong>Chunk ID:</strong> {citation.chunk_id}</p>
      </div>
      <div className="mt-2 pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-500 italic">"{citation.snippet}"</p>
      </div>
    </div>
  );
}
