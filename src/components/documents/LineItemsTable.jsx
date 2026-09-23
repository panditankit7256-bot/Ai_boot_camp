function formatCurrency(value, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 2 }).format(value);
}

export default function LineItemsTable({ items, currency = 'INR' }) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-slate-500">No line items extracted.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-slate-600">
            <th className="px-3 py-2 font-medium">Description</th>
            <th className="px-3 py-2 font-medium text-right">Qty</th>
            <th className="px-3 py-2 font-medium text-right">Unit Price</th>
            <th className="px-3 py-2 font-medium text-right">Line Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx} className="border-b border-slate-100">
              <td className="px-3 py-2 text-slate-800">{item.description}</td>
              <td className="px-3 py-2 text-right text-slate-600 tabular-nums">{item.quantity}</td>
              <td className="px-3 py-2 text-right text-slate-600 tabular-nums">{formatCurrency(item.unit_price, currency)}</td>
              <td className="px-3 py-2 text-right text-slate-700 tabular-nums font-medium">{formatCurrency(item.line_total, currency)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-slate-200">
            <td colSpan={3} className="px-3 py-2 text-right font-semibold text-slate-700">Total</td>
            <td className="px-3 py-2 text-right font-bold text-navy-800 tabular-nums">
              {formatCurrency(items.reduce((sum, i) => sum + i.line_total, 0), currency)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
