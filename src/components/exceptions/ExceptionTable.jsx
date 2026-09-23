import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';

const typeColors = {
  TOTAL_MISMATCH: 'text-red-700',
  DUPLICATE_FILE: 'text-amber-700',
  DUPLICATE_INVOICE: 'text-amber-700',
  MISSING_PATIENT_NAME: 'text-amber-700',
  MISSING_DIAGNOSIS: 'text-amber-700',
  MISSING_INSURER: 'text-amber-700',
  MISSING_INVOICE_DATE: 'text-amber-700',
  EXTRACTION_FAILED: 'text-red-700',
};

export default function ExceptionTable({ exceptions, loading }) {
  if (loading) {
    return <p className="text-sm text-slate-500 py-6 text-center">Loading exceptions...</p>;
  }
  if (!exceptions || exceptions.length === 0) {
    return <p className="text-sm text-slate-500 py-6 text-center">No exceptions found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-slate-600">
            <th className="px-3 py-2 font-medium">ID</th>
            <th className="px-3 py-2 font-medium">Document</th>
            <th className="px-3 py-2 font-medium">Invoice No</th>
            <th className="px-3 py-2 font-medium">Hospital</th>
            <th className="px-3 py-2 font-medium">Type</th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="px-3 py-2 font-medium">Message</th>
            <th className="px-3 py-2 font-medium">Created</th>
          </tr>
        </thead>
        <tbody>
          {exceptions.map((ex) => (
            <tr key={ex.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="px-3 py-2 text-slate-500">{ex.id}</td>
              <td className="px-3 py-2">
                <Link to={`/documents/${ex.document_id}`} className="text-brand-600 hover:text-brand-700 font-medium">
                  {ex.file_name}
                </Link>
              </td>
              <td className="px-3 py-2 text-slate-600">{ex.invoice_no}</td>
              <td className="px-3 py-2 text-slate-600">{ex.hospital_name}</td>
              <td className={`px-3 py-2 font-medium ${typeColors[ex.type] || 'text-slate-700'}`}>{ex.type}</td>
              <td className="px-3 py-2"><StatusBadge status={ex.status} /></td>
              <td className="px-3 py-2 text-slate-600 max-w-xs truncate">{ex.message}</td>
              <td className="px-3 py-2 text-slate-500">{ex.created_at?.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
