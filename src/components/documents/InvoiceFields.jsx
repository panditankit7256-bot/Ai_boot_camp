function Field({ label, value, highlight = false }) {
  return (
    <div>
      <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</dt>
      <dd className={`mt-0.5 text-sm ${highlight ? 'text-red-600 font-medium' : 'text-slate-800'}`}>
        {value == null || value === '' ? <span className="text-red-600">Missing</span> : value}
      </dd>
    </div>
  );
}

export default function InvoiceFields({ invoice }) {
  if (!invoice) return null;
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Field label="Invoice No" value={invoice.invoice_no} />
      <Field label="Hospital" value={invoice.hospital_name} />
      <Field label="Patient Name" value={invoice.patient_name} highlight={!invoice.patient_name} />
      <Field label="Patient ID" value={invoice.patient_id} />
      <Field label="Invoice Date" value={invoice.invoice_date} highlight={!invoice.invoice_date} />
      <Field label="Insurer" value={invoice.insurer} highlight={!invoice.insurer} />
      <Field label="Diagnosis" value={invoice.diagnosis} highlight={!invoice.diagnosis} />
      <Field label="Currency" value={invoice.currency} />
      <Field
        label="Printed Total"
        value={invoice.printed_total != null ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: invoice.currency || 'INR' }).format(invoice.printed_total) : null}
      />
      <Field
        label="Computed Total"
        value={invoice.computed_total != null ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: invoice.currency || 'INR' }).format(invoice.computed_total) : null}
      />
    </dl>
  );
}
