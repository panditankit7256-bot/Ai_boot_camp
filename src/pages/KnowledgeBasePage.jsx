import { useEffect, useState, useRef, useCallback } from 'react';
import { Play, RefreshCw, Search, Info } from 'lucide-react';
import ingestionService from '../services/ingestionService';
import { USE_MOCKS } from '../config/apiConfig';
import {
  mockIngestionJob,
  mockIngestionStats,
  mockReindexResult,
} from '../mocks/mockData';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import IndexStats from '../components/ingestion/IndexStats';
import IngestionProgress from '../components/ingestion/IngestionProgress';

export default function KnowledgeBasePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [job, setJob] = useState(null);
  const [starting, setStarting] = useState(false);
  const [reindexId, setReindexId] = useState('');
  const [reindexResult, setReindexResult] = useState(null);
  const [reindexing, setReindexing] = useState(false);
  const pollRef = useRef(null);

  const loadStats = useCallback(async () => {
    try {
      if (USE_MOCKS) {
        setStats(mockIngestionStats);
      } else {
        const data = await ingestionService.getIngestionStats();
        setStats(data);
      }
    } catch {
      // stats load is non-fatal
    }
  }, []);

  const startIngestion = async () => {
    setStarting(true);
    setError(null);
    try {
      if (USE_MOCKS) {
        setJob(mockIngestionJob);
        setStats(mockIngestionStats);
      } else {
        const data = await ingestionService.startBulkIngestion(true);
        setJob(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setStarting(false);
    }
  };

  const pollJob = useCallback(async (jobId) => {
    if (USE_MOCKS) {
      setJob((prev) => {
        if (!prev || prev.status === 'COMPLETED') return prev;
        const processed = Math.min(prev.processed + 500, prev.total_files);
        return {
          ...prev,
          processed,
          succeeded: Math.min(prev.succeeded + 480, processed),
          failed: Math.min(prev.failed + 6, processed - prev.succeeded),
          current_file: `doc_${String(processed + 1).padStart(5, '0')}.pdf`,
          status: processed >= prev.total_files ? 'COMPLETED' : 'RUNNING',
        };
      });
      return;
    }
    try {
      const data = await ingestionService.getIngestionJob(jobId);
      setJob(data);
    } catch {
      // stop polling on error
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadStats();
      setLoading(false);
    })();
  }, [loadStats]);

  useEffect(() => {
    if (job && (job.status === 'QUEUED' || job.status === 'RUNNING')) {
      pollRef.current = setInterval(() => {
        pollJob(job.job_id || job.jobId);
      }, 5000);
      return () => clearInterval(pollRef.current);
    }
  }, [job, pollJob]);

  const handleReindex = async () => {
    if (!reindexId.trim()) return;
    setReindexing(true);
    setReindexResult(null);
    setError(null);
    try {
      if (USE_MOCKS) {
        await new Promise((r) => setTimeout(r, 800));
        setReindexResult(mockReindexResult);
      } else {
        const data = await ingestionService.reindexDocument(reindexId.trim());
        setReindexResult(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setReindexing(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading knowledge base..." />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-navy-800">Knowledge Base</h2>
        <p className="text-sm text-slate-500">Bulk ingestion and vector index status.</p>
      </div>

      <div className="card p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p>The backend reads PDFs only from its configured <code className="bg-blue-100 px-1 rounded">data/source_invoices</code> folder. The browser does not upload all 18,000 files — ingestion runs server-side.</p>
            <p className="mt-1">The safe folder path is configured in the backend <code className="bg-blue-100 px-1 rounded">.env</code> file and cannot be changed from this UI.</p>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={() => setError(null)} />}

      <div className="card p-4">
        <h3 className="text-sm font-semibold text-navy-800 mb-4">Index Statistics</h3>
        <IndexStats stats={stats} />
        <div className="mt-4 flex gap-2">
          <button className="btn btn-secondary" onClick={loadStats}>
            <RefreshCw className="w-4 h-4" /> Refresh Statistics
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-semibold text-navy-800 mb-4">Bulk Ingestion</h3>
        <div className="flex gap-2 mb-4">
          <button
            className="btn btn-primary"
            onClick={startIngestion}
            disabled={starting || (job?.status === 'RUNNING' || job?.status === 'QUEUED')}
          >
            <Play className="w-4 h-4" />
            {job?.status === 'RUNNING' || job?.status === 'QUEUED' ? 'Ingestion Running...' : 'Start or Resume Bulk Ingestion'}
          </button>
        </div>
        {job && <IngestionProgress job={job} />}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-semibold text-navy-800 mb-4">Reindex Single Document</h3>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="label" htmlFor="reindex-id">Document ID</label>
            <input
              id="reindex-id"
              className="input"
              type="number"
              placeholder="e.g. 1"
              value={reindexId}
              onChange={(e) => setReindexId(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={handleReindex}
            disabled={reindexing || !reindexId.trim()}
          >
            <Search className="w-4 h-4" />
            {reindexing ? 'Reindexing...' : 'Reindex'}
          </button>
        </div>
        {reindexResult && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800">
            <p><strong>Document {reindexResult.document_id}:</strong> {reindexResult.message}</p>
            <p className="text-xs mt-1">Status: {reindexResult.status} | Chunks: {reindexResult.chunk_count}</p>
          </div>
        )}
      </div>
    </div>
  );
}
