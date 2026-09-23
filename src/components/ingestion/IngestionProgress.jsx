export default function IngestionProgress({ job }) {
  if (!job) return null;
  const percent = job.total_files > 0 ? Math.round((job.processed / job.total_files) * 100) : 0;
  const isRunning = job.status === 'QUEUED' || job.status === 'RUNNING';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">Progress: {job.processed.toLocaleString()} / {job.total_files.toLocaleString()} files</span>
        <span className="text-slate-500">{percent}%</span>
      </div>
      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${isRunning ? 'bg-brand-600' : 'bg-green-600'}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {job.current_file && isRunning && (
        <p className="text-xs text-slate-500">Processing: {job.current_file}</p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <div className="text-center">
          <p className="text-slate-500 text-xs">Succeeded</p>
          <p className="font-semibold text-green-700">{job.succeeded?.toLocaleString() || 0}</p>
        </div>
        <div className="text-center">
          <p className="text-slate-500 text-xs">Failed</p>
          <p className="font-semibold text-red-700">{job.failed?.toLocaleString() || 0}</p>
        </div>
        <div className="text-center">
          <p className="text-slate-500 text-xs">Skipped Duplicates</p>
          <p className="font-semibold text-amber-700">{job.skipped_duplicates?.toLocaleString() || 0}</p>
        </div>
        <div className="text-center">
          <p className="text-slate-500 text-xs">Status</p>
          <p className="font-semibold text-navy-700">{job.status}</p>
        </div>
      </div>
    </div>
  );
}
