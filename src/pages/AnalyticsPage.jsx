import { useEffect, useState, useCallback } from 'react';
import { Download, FileText, CheckCircle, AlertTriangle, IndianRupee, Percent } from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import analyticsService from '../services/analyticsService';
import { USE_MOCKS, API_BASE_URL } from '../config/apiConfig';
import { mockAnalyticsSummary, mockAnalyticsTrends } from '../mocks/mockData';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const PIE_COLORS = ['#3a6bf0', '#244fd6', '#5e8df5', '#94b8f9', '#1c3887', '#152152'];
const STATUS_COLORS = ['#16a34a', '#f59e0b', '#94a3b8', '#dc2626'];

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

function formatMillions(value) {
  if (value >= 1000000000) return `₹${(value / 1000000000).toFixed(2)}B`;
  if (value >= 1000000) return `₹${(value / 1000000).toFixed(0)}M`;
  return `₹${value}`;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState(null);
  const [filters, setFilters] = useState({ from_date: '', to_date: '', hospital: '' });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCKS) {
        setSummary(mockAnalyticsSummary);
        setTrends(mockAnalyticsTrends);
      } else {
        const [s, t] = await Promise.all([
          analyticsService.getAnalyticsSummary(filters),
          analyticsService.getAnalyticsTrends(filters),
        ]);
        setSummary(s);
        setTrends(t);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const exportUrl = USE_MOCKS ? '#' : `${API_BASE_URL}/api/v1/exports/invoices.xlsx`;

  if (loading) return <LoadingSpinner label="Loading analytics..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-navy-800">Analytics</h2>
          <p className="text-sm text-slate-500">Operational analytics across all processed invoices.</p>
        </div>
        <a
          href={exportUrl}
          className="btn btn-primary"
          onClick={(e) => USE_MOCKS && e.preventDefault()}
          download
        >
          <Download className="w-4 h-4" /> Download Excel
        </a>
      </div>

      <div className="card p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="label">From Date</label>
            <input type="date" className="input" value={filters.from_date} onChange={(e) => setFilters(prev => ({ ...prev, from_date: e.target.value }))} />
          </div>
          <div>
            <label className="label">To Date</label>
            <input type="date" className="input" value={filters.to_date} onChange={(e) => setFilters(prev => ({ ...prev, to_date: e.target.value }))} />
          </div>
          <div>
            <label className="label">Hospital</label>
            <input type="text" className="input" placeholder="Hospital name" value={filters.hospital} onChange={(e) => setFilters(prev => ({ ...prev, hospital: e.target.value }))} />
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button className="btn btn-primary" onClick={loadData}>Apply Filters</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        <KpiCard icon={FileText} label="Total Documents" value={summary?.total_documents?.toLocaleString() || 0} color="bg-blue-600" />
        <KpiCard icon={CheckCircle} label="Approved" value={summary?.approved_documents?.toLocaleString() || 0} color="bg-green-600" />
        <KpiCard icon={AlertTriangle} label="Review Required" value={summary?.review_required_documents?.toLocaleString() || 0} color="bg-amber-600" />
        <KpiCard icon={IndianRupee} label="Total Value" value={formatMillions(summary?.total_invoice_value || 0)} color="bg-brand-600" />
        <KpiCard icon={Percent} label="Exception Rate" value={`${summary?.exception_rate || 0}%`} color="bg-red-600" />
        <KpiCard icon={AlertTriangle} label="Duplicates" value={summary?.duplicate_invoices?.toLocaleString() || 0} color="bg-slate-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-navy-800 mb-3">Invoice Value Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trends} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3a6bf0" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3a6bf0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={formatMillions} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Area type="monotone" dataKey="invoice_value" stroke="#3a6bf0" strokeWidth={2} fill="url(#trendGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4">
          <h3 className="text-sm font-semibold text-navy-800 mb-3">Hospital Comparison</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={summary?.by_hospital || []} layout="vertical" margin={{ top: 10, right: 10, left: 80, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={formatMillions} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} formatter={(v) => formatMillions(v)} />
              <Bar dataKey="value" fill="#3a6bf0" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4">
          <h3 className="text-sm font-semibold text-navy-800 mb-3">Insurer Split</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={summary?.by_insurer || []} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name }) => name} labelLine={false}>
                {(summary?.by_insurer || []).map((_, idx) => (
                  <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} formatter={(v) => formatMillions(v)} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4">
          <h3 className="text-sm font-semibold text-navy-800 mb-3">Exception Breakdown</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={summary?.by_exception_type || []} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="type" tick={{ fontSize: 9 }} angle={-25} textAnchor="end" height={70} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4 lg:col-span-2">
          <h3 className="text-sm font-semibold text-navy-800 mb-3">Processing Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={summary?.by_status || []} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {(summary?.by_status || []).map((_, idx) => (
                  <Cell key={idx} fill={STATUS_COLORS[idx % STATUS_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
