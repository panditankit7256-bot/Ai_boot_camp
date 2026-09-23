import { useEffect, useState, useCallback } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import exceptionService from '../services/exceptionService';
import { USE_MOCKS } from '../config/apiConfig';
import { mockExceptions, mockReviewResult } from '../mocks/mockData';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import ExceptionTable from '../components/exceptions/ExceptionTable';
import StatusBadge from '../components/common/StatusBadge';

const TYPE_OPTIONS = ['', 'TOTAL_MISMATCH', 'DUPLICATE_FILE', 'DUPLICATE_INVOICE', 'MISSING_PATIENT_NAME', 'MISSING_DIAGNOSIS', 'MISSING_INSURER', 'MISSING_INVOICE_DATE', 'EXTRACTION_FAILED'];
const STATUS_OPTIONS = ['', 'OPEN', 'REVIEWED', 'RESOLVED'];

export default function ExceptionsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exceptions, setExceptions] = useState([]);
  const [selectedException, setSelectedException] = useState(null);
  const [filters, setFilters] = useState({ status: 'OPEN', type: '' });
  const [reviewForm, setReviewForm] = useState({ corrected_fields: '', reviewer_note: '', action: 'APPROVE' });
  const [submitting, setSubmitting] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);

  const loadExceptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCKS) {
        let filtered = [...mockExceptions];
        if (filters.status) filtered = filtered.filter(e => e.status === filters.status);
        if (filters.type) filtered = filtered.filter(e => e.type === filters.type);
        setExceptions(filtered);
      } else {
        const data = await exceptionService.getExceptions({ page: 1, page_size: 50, ...filters });
        setExceptions(data.items || data.exceptions || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadExceptions();
  }, [loadExceptions]);

  const handleSelectException = (ex) => {
    setSelectedException(ex);
    setReviewForm({ corrected_fields: '', reviewer_note: '', action: 'APPROVE' });
    setReviewResult(null);
  };

  const handleReview = async () => {
    if (!selectedException) return;
    setSubmitting(true);
    setReviewResult(null);
    try {
      const payload = {
        corrected_fields: reviewForm.corrected_fields ? JSON.parse(reviewForm.corrected_fields) : {},
        reviewer_note: reviewForm.reviewer_note,
        action: reviewForm.action,
      };
      if (USE_MOCKS) {
        await new Promise((r) => setTimeout(r, 600));
        setReviewResult(mockReviewResult);
      } else {
        const data = await exceptionService.reviewException(selectedException.id, payload);
        setReviewResult(data);
      }
    } catch (err) {
      setReviewResult({ error: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-navy-800">Exceptions</h2>
        <p className="text-sm text-slate-500">Review and resolve processing exceptions.</p>
      </div>

      <div className="card p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="label">Status</label>
            <select className="input" value={filters.status} onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s || 'All'}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Exception Type</label>
            <select className="input" value={filters.type} onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}>
              {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t || 'All'}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button className="btn btn-primary w-full" onClick={loadExceptions}>Apply Filters</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card p-4">
          {error ? (
            <ErrorMessage message={error} onRetry={loadExceptions} />
          ) : loading ? (
            <LoadingSpinner label="Loading exceptions..." />
          ) : (
            <ExceptionTable exceptions={exceptions} loading={loading} />
          )}
        </div>

        <div className="card p-4">
          <h3 className="text-sm font-semibold text-navy-800 mb-3">Review Panel</h3>
          {!selectedException ? (
            <p className="text-sm text-slate-500">Select an exception from the table to review it.</p>
          ) : (
            <div className="space-y-3">
              <div className="text-sm">
                <p className="text-slate-500 text-xs">Exception ID</p>
                <p className="font-medium text-slate-800">{selectedException.id}</p>
                <p className="text-slate-500 text-xs mt-2">Type</p>
                <p className="font-medium text-amber-700">{selectedException.type}</p>
                <p className="text-slate-500 text-xs mt-2">Message</p>
                <p className="text-slate-600">{selectedException.message}</p>
                <p className="text-slate-500 text-xs mt-2">Current Status</p>
                <StatusBadge status={selectedException.status} />
              </div>
              <div>
                <label className="label">Corrected Fields (JSON)</label>
                <textarea
                  className="input font-mono text-xs"
                  rows={3}
                  placeholder='{"printed_total": 105442.33}'
                  value={reviewForm.corrected_fields}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, corrected_fields: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Reviewer Note</label>
                <textarea
                  className="input"
                  rows={2}
                  placeholder="Add a note about this review..."
                  value={reviewForm.reviewer_note}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, reviewer_note: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Action</label>
                <select
                  className="input"
                  value={reviewForm.action}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, action: e.target.value }))}
                >
                  <option value="APPROVE">Approve</option>
                  <option value="REJECT">Reject</option>
                </select>
              </div>
              <button className="btn btn-primary w-full" onClick={handleReview} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              {reviewResult && !reviewResult.error && (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Review submitted: {reviewResult.action} — {reviewResult.status}</span>
                </div>
              )}
              {reviewResult?.error && (
                <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-2">
                  <XCircle className="w-4 h-4" />
                  <span>{reviewResult.error}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
