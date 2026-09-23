import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';

function formatCurrency(value) {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);
}

function formatDate(value) {
  if (!value) return '—';
  return value.slice(0, 10);
}

export default function DocumentTable({ documents, loading, pagination, onPageChange }) {
  if (loading) {
    return <p className="text-sm text-slate-500 py-6 text-center">Loading documents...</p>;
  }
  if (!documents || documents.length === 0) {
    return <p className="text-sm text-slate-500 py-6 text-center">No documents found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-slate-600">
            <th className="px-3 py-2 font-medium">ID</th>
            <th className="px-3 py-2 font-medium">File Name</th>
            <th className="px-3 py-2 font-medium">Source</th>
            <th className="px-3 py-2 font-medium">Invoice No</th>
            <th className="px-3 py-2 font-medium">Hospital</th>
            <th className="px-3 py-2 font-medium">Patient</th>
            <th className="px-3 py-2 font-medium">Date</th>
            <th className="px-3 py-2 font-medium text-right">Total</th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="px-3 py-2 font-medium">Vector</th>
            <th className="px-3 py-2 font-medium text-center">Excp.</th>
            <th className="px-3 py-2 font-medium text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="px-3 py-2 text-slate-500">{doc.id}</td>
              <td className="px-3 py-2 font-medium text-navy-800">{doc.file_name}</td>
              <td className="px-3 py-2 text-slate-600">{doc.source_type === 'BULK_FOLDER' ? 'Bulk' : 'Upload'}</td>
              <td className="px-3 py-2 text-slate-600">{doc.invoice_no || '—'}</td>
              <td className="px-3 py-2 text-slate-600">{doc.hospital_name || '—'}</td>
              <td className="px-3 py-2 text-slate-600">{doc.patient_name || <span className="text-red-600 font-medium">Missing</span>}</td>
              <td className="px-3 py-2 text-slate-600">{formatDate(doc.invoice_date)}</td>
              <td className="px-3 py-2 text-right text-slate-700 tabular-nums">{formatCurrency(doc.printed_total)}</td>
              <td className="px-3 py-2"><StatusBadge status={doc.status} /></td>
              <td className="px-3 py-2"><StatusBadge status={doc.vector_status} /></td>
              <td className="px-3 py-2 text-center">
                {doc.exception_count > 0 ? (
                  <span className="text-amber-700 font-medium">{doc.exception_count}</span>
                ) : (
                  <span className="text-slate-400">0</span>
                )}
              </td>
              <td className="px-3 py-2 text-center">
                <Link
                  to={`/documents/${doc.id}`}
                  className="text-brand-600 hover:text-brand-700 font-medium"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {pagination && (
        <div className="flex items-center justify-between px-3 py-3 text-sm text-slate-600">
          <span>
            Page {pagination.page} of {pagination.total_pages} ({pagination.total} total)
          </span>
          <div className="flex gap-2">
            <button
              className="btn btn-secondary !px-3 !py-1.5"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange(pagination.page - 1)}
            >
              Previous
            </button>
            <button
              className="btn btn-secondary !px-3 !py-1.5"
              disabled={pagination.page >= pagination.total_pages}
              onClick={() => onPageChange(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
