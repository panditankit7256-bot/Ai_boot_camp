import { useEffect, useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import documentService from '../services/documentService';
import { USE_MOCKS } from '../config/apiConfig';
import { mockDocuments } from '../mocks/mockData';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import DocumentTable from '../components/documents/DocumentTable';

const STATUS_OPTIONS = ['', 'APPROVED', 'REVIEW_REQUIRED', 'PENDING', 'EXTRACTION_FAILED'];
const SOURCE_OPTIONS = ['', 'BULK_FOLDER', 'UI_UPLOAD'];
const VECTOR_OPTIONS = ['', 'INDEXED', 'PENDING', 'NOT_INDEXED', 'FAILED'];
const EXCEPTION_OPTIONS = ['', 'TOTAL_MISMATCH', 'DUPLICATE_FILE', 'DUPLICATE_INVOICE', 'MISSING_PATIENT_NAME', 'MISSING_DIAGNOSIS', 'MISSING_INSURER', 'MISSING_INVOICE_DATE', 'EXTRACTION_FAILED'];

export default function DocumentsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    source_type: '',
    vector_status: '',
    hospital: '',
    exception_type: '',
  });
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCKS) {
        let filtered = [...mockDocuments];
        if (filters.search) {
          const q = filters.search.toLowerCase();
          filtered = filtered.filter(d =>
            d.file_name.toLowerCase().includes(q) ||
            d.invoice_no?.toLowerCase().includes(q) ||
            d.hospital_name?.toLowerCase().includes(q) ||
            d.patient_name?.toLowerCase().includes(q)
          );
        }
        if (filters.status) filtered = filtered.filter(d => d.status === filters.status);
        if (filters.source_type) filtered = filtered.filter(d => d.source_type === filters.source_type);
        if (filters.vector_status) filtered = filtered.filter(d => d.vector_status === filters.vector_status);
        if (filters.hospital) filtered = filtered.filter(d => d.hospital_name?.toLowerCase().includes(filters.hospital.toLowerCase()));
        if (filters.exception_type) filtered = filtered.filter(d => d.exception_types?.includes(filters.exception_type));
        const total = filtered.length;
        const totalPages = Math.ceil(total / pageSize) || 1;
        const start = (page - 1) * pageSize;
        setDocuments(filtered.slice(start, start + pageSize));
        setPagination({ page, total, total_pages: totalPages });
      } else {
        const data = await documentService.getDocuments({ page, page_size: pageSize, ...filters });
        setDocuments(data.items || data.documents || []);
        setPagination({
          page: data.page || page,
          total: data.total || 0,
          total_pages: data.total_pages || Math.ceil((data.total || 0) / pageSize) || 1,
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadDocuments();
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-navy-800">Documents</h2>
        <p className="text-sm text-slate-500">Search and filter processed invoices.</p>
      </div>

      <form onSubmit={handleSearch} className="card p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          <div className="xl:col-span-2">
            <label className="label">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                className="input pl-9"
                placeholder="File, invoice, hospital, patient..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s || 'All'}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Source</label>
            <select className="input" value={filters.source_type} onChange={(e) => handleFilterChange('source_type', e.target.value)}>
              {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s || 'All'}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Vector Status</label>
            <select className="input" value={filters.vector_status} onChange={(e) => handleFilterChange('vector_status', e.target.value)}>
              {VECTOR_OPTIONS.map(s => <option key={s} value={s}>{s || 'All'}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Exception Type</label>
            <select className="input" value={filters.exception_type} onChange={(e) => handleFilterChange('exception_type', e.target.value)}>
              {EXCEPTION_OPTIONS.map(s => <option key={s} value={s}>{s || 'All'}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button type="submit" className="btn btn-primary">Apply Filters</button>
        </div>
      </form>

      <div className="card p-4">
        {error ? (
          <ErrorMessage message={error} onRetry={loadDocuments} />
        ) : loading ? (
          <LoadingSpinner label="Loading documents..." />
        ) : (
          <DocumentTable
            documents={documents}
            loading={loading}
            pagination={pagination}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
