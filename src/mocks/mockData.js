function makeDocuments(count) {
  const hospitals = [
    'Lifeline Medical Centre',
    'St. Mary Hospital',
    'Greenfield Health',
    'Apex Care Hospital',
    'Riverside Medical',
  ];
  const patients = [
    'Aryan Maharaj', 'Priya Sharma', 'John Daniels', 'Emma Wilson',
    'Carlos Mendez', 'Yuki Tanaka', 'Fatima Khan', 'Liam O\u2019Brien',
  ];
  const statuses = ['APPROVED', 'REVIEW_REQUIRED', 'PENDING', 'EXTRACTION_FAILED'];
  const vectorStatuses = ['INDEXED', 'PENDING', 'NOT_INDEXED', 'FAILED'];
  const sources = ['BULK_FOLDER', 'UI_UPLOAD'];
  const exceptionTypes = ['TOTAL_MISMATCH', 'DUPLICATE_FILE', 'DUPLICATE_INVOICE', 'MISSING_PATIENT_NAME', 'MISSING_DIAGNOSIS', 'MISSING_INSURER', 'MISSING_INVOICE_DATE', 'EXTRACTION_FAILED'];

  const docs = [];
  for (let i = 1; i <= count; i++) {
    const status = statuses[i % statuses.length];
    const hasException = status === 'REVIEW_REQUIRED' || status === 'EXTRACTION_FAILED';
    docs.push({
      id: i,
      file_name: `doc_${String(i).padStart(5, '0')}.pdf`,
      source_type: sources[i % 2],
      invoice_no: `INV-${100000 + i}`,
      hospital_name: hospitals[i % hospitals.length],
      patient_name: i % 7 === 0 ? null : patients[i % patients.length],
      invoice_date: `2025-${String((i % 12) + 1).padStart(2, '0')}-01`,
      printed_total: Math.round((10000 + i * 137.42) * 100) / 100,
      status,
      vector_status: vectorStatuses[i % vectorStatuses.length],
      exception_count: hasException ? (i % 3) + 1 : 0,
      exception_types: hasException ? [exceptionTypes[i % exceptionTypes.length]] : [],
      created_at: `2026-09-${String(20 - (i % 10)).padStart(2, '0')}T10:30:00Z`,
    });
  }
  return docs;
}

export const mockDocuments = makeDocuments(42);

export const mockDocumentDetail = {
  ...mockDocuments[0],
  file_info: {
    file_name: 'doc_00001.pdf',
    file_size: 248320,
    page_count: 3,
    sha256: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
    source_type: 'BULK_FOLDER',
    uploaded_at: '2026-09-22T10:30:00Z',
  },
  extraction: {
    method: 'NATIVE_TEXT',
    ocr_pages: [2],
    ocr_status: 'COMPLETED',
    extracted_at: '2026-09-22T10:31:15Z',
  },
  invoice: {
    invoice_no: 'INV-100001',
    hospital_name: 'Lifeline Medical Centre',
    patient_name: 'Aryan Maharaj',
    patient_id: 'PT-2025-0042',
    invoice_date: '2025-06-01',
    insurer: 'MediShield Plus',
    diagnosis: 'Acute appendicitis',
    printed_total: 105442.33,
    computed_total: 105442.33,
    currency: 'INR',
  },
  line_items: [
    { description: 'Room charges (3 days)', quantity: 3, unit_price: 4500, line_total: 13500 },
    { description: 'Laparoscopic appendectomy', quantity: 1, unit_price: 75000, line_total: 75000 },
    { description: 'Anaesthesia', quantity: 1, unit_price: 12000, line_total: 12000 },
    { description: 'Pharmacy', quantity: 1, unit_price: 4942.33, line_total: 4942.33 },
  ],
  validation: {
    totals_match: true,
    missing_fields: [],
    warnings: [],
    validated_at: '2026-09-22T10:31:40Z',
  },
  exceptions: [
    {
      id: 101,
      type: 'MISSING_DIAGNOSIS',
      status: 'OPEN',
      message: 'Diagnosis field was not detected on page 1.',
      created_at: '2026-09-22T10:32:00Z',
    },
  ],
  audit_trail: [
    { action: 'DISCOVERED', at: '2026-09-22T10:30:00Z', detail: 'File discovered in source_invoices' },
    { action: 'TEXT_EXTRACTED', at: '2026-09-22T10:30:45Z', detail: 'Native text extracted from 3 pages' },
    { action: 'OCR_COMPLETED', at: '2026-09-22T10:31:15Z', detail: 'Page 2 processed with vision OCR' },
    { action: 'VALIDATED', at: '2026-09-22T10:31:40Z', detail: 'Totals match, 1 missing field' },
    { action: 'INDEXED', at: '2026-09-22T10:32:10Z', detail: '12 chunks upserted into Chroma' },
  ],
  vector: {
    status: 'INDEXED',
    chunk_count: 12,
    indexed_at: '2026-09-22T10:32:10Z',
  },
};

export const mockUploadResult = {
  uploaded: 3,
  succeeded: 2,
  failed: 1,
  results: [
    { file_name: 'invoice_001.pdf', status: 'PROCESSED', document_id: 43, message: 'Extracted and indexed successfully' },
    { file_name: 'invoice_002.pdf', status: 'PROCESSED', document_id: 44, message: 'Extracted and indexed successfully' },
    { file_name: 'invoice_003.pdf', status: 'FAILED', document_id: null, message: 'Could not extract text from any page' },
  ],
};

export const mockReprocessResult = {
  document_id: 1,
  status: 'PROCESSED',
  message: 'Document reprocessed successfully',
  vector_status: 'INDEXED',
};

export const mockIngestionJob = {
  job_id: 'job-001',
  status: 'RUNNING',
  total_files: 18000,
  processed: 7234,
  succeeded: 7100,
  failed: 89,
  skipped_duplicates: 45,
  current_file: 'doc_07235.pdf',
  started_at: '2026-09-23T08:00:00Z',
  estimated_completion: '2026-09-23T14:00:00Z',
};

export const mockIngestionStats = {
  source_folder: 'data/source_invoices',
  discovered_pdfs: 18000,
  processed: 7234,
  succeeded: 7100,
  failed: 89,
  skipped_duplicates: 45,
  indexed_documents: 7100,
  indexed_chunks: 85200,
  last_run_at: '2026-09-23T08:00:00Z',
};

export const mockReindexResult = {
  document_id: 1,
  status: 'INDEXED',
  chunk_count: 12,
  message: 'Document re-indexed successfully',
};

export function makeExceptions(count) {
  const types = ['TOTAL_MISMATCH', 'DUPLICATE_FILE', 'DUPLICATE_INVOICE', 'MISSING_PATIENT_NAME', 'MISSING_DIAGNOSIS', 'MISSING_INSURER', 'MISSING_INVOICE_DATE', 'EXTRACTION_FAILED'];
  const statuses = ['OPEN', 'REVIEWED', 'RESOLVED'];
  const exceptions = [];
  for (let i = 1; i <= count; i++) {
    exceptions.push({
      id: 100 + i,
      document_id: ((i - 1) % 42) + 1,
      file_name: `doc_${String(((i - 1) % 42) + 1).padStart(5, '0')}.pdf`,
      invoice_no: `INV-${100000 + ((i - 1) % 42) + 1}`,
      hospital_name: ['Lifeline Medical Centre', 'St. Mary Hospital', 'Greenfield Health'][i % 3],
      type: types[i % types.length],
      status: statuses[i % statuses.length],
      message: `Exception of type ${types[i % types.length]} detected during processing.`,
      created_at: `2026-09-${String(20 - (i % 10)).padStart(2, '0')}T10:35:00Z`,
      reviewed_at: i % 3 === 1 ? '2026-09-22T12:00:00Z' : null,
      reviewer_note: i % 3 === 1 ? 'Corrected total after manual review.' : null,
    });
  }
  return exceptions;
}

export const mockExceptions = makeExceptions(24);

export const mockReviewResult = {
  exception_id: 101,
  status: 'RESOLVED',
  action: 'APPROVE',
  reviewer_note: 'Totals verified manually.',
  reviewed_at: '2026-09-23T09:00:00Z',
};

export const mockChatResponse = {
  answer: 'The printed total for invoice INV-100001 is INR 105,442.33. This was extracted from page 1 of doc_00001.pdf and the computed total matches.',
  citations: [
    {
      document_id: 1,
      invoice_no: 'INV-100001',
      file_name: 'doc_00001.pdf',
      page_number: 1,
      chunk_id: 'doc-1-page-1-chunk-1',
      snippet: 'Grand Total 105,442.33',
    },
    {
      document_id: 1,
      invoice_no: 'INV-100001',
      file_name: 'doc_00001.pdf',
      page_number: 1,
      chunk_id: 'doc-1-page-1-chunk-2',
      snippet: 'Hospital: Lifeline Medical Centre | Patient: Aryan Maharaj',
    },
  ],
};

export const mockAnalyticsSummary = {
  total_documents: 18000,
  approved_documents: 14200,
  review_required_documents: 3100,
  duplicate_invoices: 700,
  total_invoice_value: 2450000000,
  exception_rate: 17.2,
  by_hospital: [
    { name: 'Lifeline Medical Centre', value: 840000000, count: 5200 },
    { name: 'St. Mary Hospital', value: 620000000, count: 4100 },
    { name: 'Greenfield Health', value: 480000000, count: 3200 },
    { name: 'Apex Care Hospital', value: 310000000, count: 2800 },
    { name: 'Riverside Medical', value: 200000000, count: 2700 },
  ],
  by_insurer: [
    { name: 'MediShield Plus', value: 1200000000, count: 8000 },
    { name: 'HealthGuard', value: 650000000, count: 5000 },
    { name: 'CareSecure', value: 380000000, count: 3000 },
    { name: 'Other', value: 220000000, count: 2000 },
  ],
  by_exception_type: [
    { type: 'TOTAL_MISMATCH', count: 1200 },
    { type: 'DUPLICATE_FILE', count: 700 },
    { type: 'MISSING_PATIENT_NAME', count: 580 },
    { type: 'MISSING_DIAGNOSIS', count: 420 },
    { type: 'MISSING_INSURER', count: 310 },
    { type: 'MISSING_INVOICE_DATE', count: 180 },
    { type: 'EXTRACTION_FAILED', count: 90 },
    { type: 'DUPLICATE_INVOICE', count: 75 },
  ],
  by_status: [
    { name: 'Approved', value: 14200 },
    { name: 'Review Required', value: 3100 },
    { name: 'Pending', value: 400 },
    { name: 'Extraction Failed', value: 300 },
  ],
};

export const mockAnalyticsTrends = [
  { month: '2025-01', invoice_value: 180000000, count: 1200 },
  { month: '2025-02', invoice_value: 195000000, count: 1300 },
  { month: '2025-03', invoice_value: 210000000, count: 1400 },
  { month: '2025-04', invoice_value: 188000000, count: 1250 },
  { month: '2025-05', invoice_value: 225000000, count: 1500 },
  { month: '2025-06', invoice_value: 240000000, count: 1600 },
  { month: '2025-07', invoice_value: 215000000, count: 1450 },
  { month: '2025-08', invoice_value: 260000000, count: 1700 },
  { month: '2025-09', invoice_value: 278000000, count: 1800 },
];
