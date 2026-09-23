import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Copy,
  IndianRupee,
  Percent,
} from 'lucide-react';
import documentService from '../services/documentService';
import analyticsService from '../services/analyticsService';
import { USE_MOCKS } from '../config/apiConfig';
import {
  mockDocuments,
  mockAnalyticsSummary,
  mockAnalyticsTrends,
} from '../mocks/mockData';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import ExceptionChart from '../components/charts/ExceptionChart';
import InvoiceTrendChart from '../components/charts/InvoiceTrendChart';
import DocumentTable from '../components/documents/DocumentTable';

function KpiCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState(null);
  const [recentDocs, setRecentDocs] = useState([]);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCKS) {
        setSummary(mockAnalyticsSummary);
        setTrends(mockAnalyticsTrends);
        setRecentDocs(mockDocuments.slice(0, 5));
      } else {
        const [summRes, trendRes, docRes] = await Promise.all([
          analyticsService.getAnalyticsSummary(),
          analyticsService.getAnalyticsTrends(),
          documentService.getDocuments({ page: 1, page_size: 5 }),
        ]);
        setSummary(summRes);
        setTrends(trendRes);
        setRecentDocs(docRes.items || docRes.documents || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <LoadingSpinner label="Loading dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-navy-800">Operations Dashboard</h2>
        <p className="text-sm text-slate-500">Overview of document processing, exceptions and invoice values.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <KpiCard icon={FileText} label="Total Documents" value={summary?.total_documents?.toLocaleString() || 0} color="bg-blue-600" />
        <KpiCard icon={CheckCircle} label="Approved" value={summary?.approved_documents?.toLocaleString() || 0} color="bg-green-600" />
        <KpiCard icon={AlertTriangle} label="Review Required" value={summary?.review_required_documents?.toLocaleString() || 0} color="bg-amber-600" />
        <KpiCard icon={Copy} label="Duplicates" value={summary?.duplicate_invoices?.toLocaleString() || 0} color="bg-slate-600" />
        <KpiCard icon={IndianRupee} label="Total Invoice Value" value={`₹${((summary?.total_invoice_value || 0) / 1000000000).toFixed(2)}B`} color="bg-brand-600" />
        <KpiCard icon={Percent} label="Exception Rate" value={`${summary?.exception_rate || 0}%`} color="bg-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-navy-800 mb-3">Invoice Value Trend</h3>
          <InvoiceTrendChart data={trends} />
        </div>
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-navy-800 mb-3">Exception Breakdown</h3>
          <ExceptionChart data={summary?.by_exception_type || []} />
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-navy-800">Recent Documents</h3>
          <Link to="/documents" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            View All →
          </Link>
        </div>
        <DocumentTable documents={recentDocs} />
      </div>
    </div>
  );
}
