import api from './api';
import {
  mockIngestionJob,
  mockIngestionStats,
  mockReindexResult,
} from '../mocks/mockData';

export async function startBulkIngestion(recursive = true) {
  const res = await api.post('/api/v1/ingestion/bulk', { recursive });
  return res.data;
}

export async function getIngestionJob(jobId) {
  const res = await api.get(`/api/v1/ingestion/jobs/${jobId}`);
  return res.data;
}

export async function getIngestionStats() {
  const res = await api.get('/api/v1/ingestion/stats');
  return res.data;
}

export async function reindexDocument(documentId) {
  const res = await api.post(`/api/v1/ingestion/reindex/${documentId}`);
  return res.data;
}

const ingestionService = {
  startBulkIngestion,
  getIngestionJob,
  getIngestionStats,
  reindexDocument,
  mockIngestionJob,
  mockIngestionStats,
  mockReindexResult,
};

export default ingestionService;
