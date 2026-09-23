import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Send, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import documentService from '../services/documentService';
import ingestionService from '../services/ingestionService';
import { USE_MOCKS } from '../config/apiConfig';
import { mockDocumentDetail, mockReprocessResult, mockReindexResult } from '../mocks/mockData';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import StatusBadge from '../components/common/StatusBadge';
import InvoiceFields from '../components/documents/InvoiceFields';
import LineItemsTable from '../components/documents/LineItemsTable';

function formatBytes(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function Section({ title, children }) {
  return (
    <div className="card p-4">
      <h3 className="text-sm font-semibold text-navy-800 mb-3">{title}</h3>
      {children}
    </div>
  );
}

export default function DocumentDetailPage() {
  const { documentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doc, setDoc] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionResult, setActionResult] = useState(null);

  const loadDoc = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCKS) {
        setDoc({ ...mockDocumentDetail, id: Number(documentId) });
      } else {
        const data = await documentService.getDocumentById(documentId);
        setDoc(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    loadDoc();
  }, [loadDoc]);

  const handleReprocess = async () => {
    setActionLoading(true);
    setActionResult(null);
    try {
      if (USE_MOCKS) {
        await new Promise((r) => setTimeout(r, 800));
        setActionResult({ type: 'reprocess', ...mockReprocessResult });
      } else {
        const data = await documentService.reprocessDocument(documentId);
        setActionResult({ type: 'reprocess', ...data });
      }
    } catch (err) {
      setActionResult({ type: 'error', message: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendToReview = () => {
    setActionResult({ type: 'review', message: 'Document sent to review queue.' });
  };

  const handleReindex = async () => {
    setActionLoading(true);
    setActionResult(null);
    try {
      if (USE_MOCKS) {
        await new Promise((r) => setTimeout(r, 800));
        setActionResult({ type: 'reindex', ...mockReindexResult });
      } else {
        const data = await ingestionService.reindexDocument(documentId);
        setActionResult({ type: 'reindex', ...data });
      }
    } catch (err) {
      setActionResult({ type: 'error', message: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading document..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadDoc} />;
  if (!doc) return <ErrorMessage message="Document not found" />;

  const invoice = doc.invoice || doc;
  const totalsMatch = doc.validation?.totals_match ?? (invoice.printed_total === invoice.computed_total);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link to="/documents" className="text-brand-600 hover:text-brand-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-lg font-semibold text-navy-800">{doc.file_name || doc.file_info?.file_name}</h2>
          <p className="text-sm text-slate-500">Document ID: {doc.id}</p>
        </div>
      </div>

      {actionResult && (
        <div className={`p-3 rounded-md text-sm border ${
          actionResult.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-800'
            : 'bg-green-50 border-green-200 text-green-800'
        }`}>
          {actionResult.message || `${actionResult.type} completed: ${actionResult.status}`}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button className="btn btn-primary" onClick={handleReprocess} disabled={actionLoading}>
          <RefreshCw className="w-4 h-4" /> Reprocess
        </button>
        <button className="btn btn-secondary" onClick={handleSendToReview} disabled={actionLoading}>
          <Send className="w-4 h-4" /> Send to Review
        </button>
        <button className="btn btn-secondary" onClick={handleReindex} disabled={actionLoading}>
          Reindex
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="File Information">
          <dl className="space-y-1.5 text-sm">
            <div><dt className="text-xs text-slate-500">File Name</dt><dd className="text-slate-800">{doc.file_info?.file_name || doc.file_name}</dd></div>
            <div><dt className="text-xs text-slate-500">Size</dt><dd className="text-slate-800">{formatBytes(doc.file_info?.file_size)}</dd></div>
            <div><dt className="text-xs text-slate-500">Pages</dt><dd className="text-slate-800">{doc.file_info?.page_count || '—'}</dd></div>
            <div><dt className="text-xs text-slate-500">SHA-256</dt><dd className="text-slate-800 font-mono text-xs break-all">{doc.file_info?.sha256 || '—'}</dd></div>
            <div><dt className="text-xs text-slate-500">Source</dt><dd className="text-slate-800">{doc.file_info?.source_type || doc.source_type}</dd></div>
            <div><dt className="text-xs text-slate-500">Uploaded</dt><dd className="text-slate-800">{doc.file_info?.uploaded_at?.slice(0, 19).replace('T', ' ') || doc.created_at?.slice(0, 19).replace('T', ' ')}</dd></div>
          </dl>
        </Section>

        <Section title="Extraction & Indexing">
          <dl className="space-y-1.5 text-sm">
            <div><dt className="text-xs text-slate-500">Extraction Method</dt><dd className="text-slate-800">{doc.extraction?.method || '—'}</dd></div>
            <div><dt className="text-xs text-slate-500">OCR Pages</dt><dd className="text-slate-800">{doc.extraction?.ocr_pages?.join(', ') || 'None'}</dd></div>
            <div><dt className="text-xs text-slate-500">OCR Status</dt><dd><StatusBadge status={doc.extraction?.ocr_status || 'PENDING'} /></dd></div>
            <div><dt className="text-xs text-slate-500">Vector Status</dt><dd><StatusBadge status={doc.vector_status || doc.vector?.status} /></dd></div>
            <div><dt className="text-xs text-slate-500">Chunk Count</dt><dd className="text-slate-800">{doc.vector?.chunk_count ?? '—'}</dd></div>
            <div><dt className="text-xs text-slate-500">Indexed At</dt><dd className="text-slate-800">{doc.vector?.indexed_at?.slice(0, 19).replace('T', ' ') || '—'}</dd></div>
          </dl>
        </Section>

        <Section title="Validation Results">
          <div className="space-y-2 text-sm">
            <div className={`flex items-center gap-2 ${totalsMatch ? 'text-green-700' : 'text-red-700'}`}>
              {totalsMatch ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              <span>Totals {totalsMatch ? 'Match' : 'Mismatch'}</span>
            </div>
            {doc.validation?.missing_fields?.length > 0 && (
              <div className="flex items-center gap-2 text-amber-700">
                <AlertTriangle className="w-4 h-4" />
                <span>Missing: {doc.validation.missing_fields.join(', ')}</span>
              </div>
            )}
            {doc.validation?.warnings?.length > 0 && (
              <div className="text-amber-700 text-xs">
                <p>Warnings:</p>
                <ul className="list-disc list-inside">
                  {doc.validation.warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}
            <p className="text-xs text-slate-400">Validated at: {doc.validation?.validated_at?.slice(0, 19).replace('T', ' ') || '—'}</p>
          </div>
        </Section>
      </div>

      <Section title="Invoice Header Fields">
        <InvoiceFields invoice={invoice} />
      </Section>

      <Section title="Line Items">
        <LineItemsTable items={doc.line_items} currency={invoice.currency} />
      </Section>

      {doc.exceptions?.length > 0 && (
        <Section title="Exceptions">
          <div className="space-y-2">
            {doc.exceptions.map((ex) => (
              <div key={ex.id} className="flex items-start gap-2 text-sm border-b border-slate-100 pb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-800">{ex.type} <StatusBadge status={ex.status} /></p>
                  <p className="text-slate-600 text-xs">{ex.message}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title="Audit Trail">
        <ol className="space-y-2 text-sm">
          {doc.audit_trail?.map((entry, idx) => (
            <li key={idx} className="flex items-start gap-3 border-b border-slate-100 pb-2">
              <span className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0" />
              <div>
                <p className="font-medium text-slate-800">{entry.action}</p>
                <p className="text-slate-500 text-xs">{entry.detail}</p>
                <p className="text-slate-400 text-xs">{entry.at?.slice(0, 19).replace('T', ' ')}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}
