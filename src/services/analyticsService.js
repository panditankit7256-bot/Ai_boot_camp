import api from './api';
import {
  mockAnalyticsSummary,
  mockAnalyticsTrends,
} from '../mocks/mockData';

export async function getAnalyticsSummary(params = {}) {
  const res = await api.get('/api/v1/analytics/summary', { params });
  return res.data;
}

export async function getAnalyticsTrends(params = {}) {
  const res = await api.get('/api/v1/analytics/trends', { params });
  return res.data;
}

export function getExportUrl() {
  return api.defaults.baseURL + '/api/v1/exports/invoices.xlsx';
}

const analyticsService = {
  getAnalyticsSummary,
  getAnalyticsTrends,
  getExportUrl,
  mockAnalyticsSummary,
  mockAnalyticsTrends,
};

export default analyticsService;
