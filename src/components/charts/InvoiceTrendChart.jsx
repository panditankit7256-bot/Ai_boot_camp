import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function formatMillions(value) {
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
  return value;
}

export default function InvoiceTrendChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-sm text-slate-500 py-6 text-center">No trend data available.</p>;
  }
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
        <defs>
          <linearGradient id="invoiceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3a6bf0" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3a6bf0" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis tickFormatter={formatMillions} tick={{ fontSize: 11 }} />
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
          formatter={(value) => [`₹${formatMillions(value)}`, 'Invoice Value']}
        />
        <Area
          type="monotone"
          dataKey="invoice_value"
          stroke="#3a6bf0"
          strokeWidth={2}
          fill="url(#invoiceGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
