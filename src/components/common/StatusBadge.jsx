const statusConfig = {
  APPROVED: { label: 'Approved', className: 'bg-green-100 text-green-800 border-green-300' },
  REVIEW_REQUIRED: { label: 'Review Required', className: 'bg-amber-100 text-amber-800 border-amber-300' },
  PENDING: { label: 'Pending', className: 'bg-slate-100 text-slate-700 border-slate-300' },
  EXTRACTION_FAILED: { label: 'Extraction Failed', className: 'bg-red-100 text-red-800 border-red-300' },
  INDEXED: { label: 'Indexed', className: 'bg-green-100 text-green-800 border-green-300' },
  NOT_INDEXED: { label: 'Not Indexed', className: 'bg-slate-100 text-slate-700 border-slate-300' },
  FAILED: { label: 'Failed', className: 'bg-red-100 text-red-800 border-red-300' },
  OPEN: { label: 'Open', className: 'bg-amber-100 text-amber-800 border-amber-300' },
  REVIEWED: { label: 'Reviewed', className: 'bg-slate-100 text-slate-700 border-slate-300' },
  RESOLVED: { label: 'Resolved', className: 'bg-green-100 text-green-800 border-green-300' },
  QUEUED: { label: 'Queued', className: 'bg-slate-100 text-slate-700 border-slate-300' },
  RUNNING: { label: 'Running', className: 'bg-blue-100 text-blue-800 border-blue-300' },
  COMPLETED: { label: 'Completed', className: 'bg-green-100 text-green-800 border-green-300' },
  PROCESSED: { label: 'Processed', className: 'bg-green-100 text-green-800 border-green-300' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || {
    label: status,
    className: 'bg-slate-100 text-slate-700 border-slate-300',
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
