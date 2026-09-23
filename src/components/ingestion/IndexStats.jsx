import { Database, FileText, CheckCircle, XCircle, Copy, Layers, FolderOpen } from 'lucide-react';

function StatCard({ icon: Icon, label, value, color = 'text-navy-700' }) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <Icon className={`w-6 h-6 ${color}`} />
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-lg font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

export default function IndexStats({ stats }) {
  if (!stats) return null;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <FolderOpen className="w-4 h-4" />
        <span>Source folder: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-navy-700">{stats.source_folder}</code></span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <StatCard icon={FileText} label="Discovered PDFs" value={stats.discovered_pdfs?.toLocaleString() || 0} color="text-blue-600" />
        <StatCard icon={CheckCircle} label="Processed" value={stats.processed?.toLocaleString() || 0} color="text-brand-600" />
        <StatCard icon={CheckCircle} label="Succeeded" value={stats.succeeded?.toLocaleString() || 0} color="text-green-600" />
        <StatCard icon={XCircle} label="Failed" value={stats.failed?.toLocaleString() || 0} color="text-red-600" />
        <StatCard icon={Copy} label="Skipped Duplicates" value={stats.skipped_duplicates?.toLocaleString() || 0} color="text-amber-600" />
        <StatCard icon={Database} label="Indexed Documents" value={stats.indexed_documents?.toLocaleString() || 0} color="text-brand-600" />
        <StatCard icon={Layers} label="Indexed Chunks" value={stats.indexed_chunks?.toLocaleString() || 0} color="text-navy-600" />
        <StatCard icon={FileText} label="Last Run" value={stats.last_run_at?.slice(0, 16).replace('T', ' ') || '—'} color="text-slate-600" />
      </div>
    </div>
  );
}
