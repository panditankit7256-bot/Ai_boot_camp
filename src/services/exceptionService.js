import api from './api';
import {
  mockExceptions,
  mockReviewResult,
} from '../mocks/mockData';

export async function getExceptions(params = {}) {
  const { page = 1, page_size = 20, status = '', type = '' } = params;
  const res = await api.get('/api/v1/exceptions', {
    params: { page, page_size, status, type },
  });
  return res.data;
}

export async function reviewException(exceptionId, payload) {
  const res = await api.patch(`/api/v1/exceptions/${exceptionId}/review`, payload);
  return res.data;
}

const exceptionService = {
  getExceptions,
  reviewException,
  mockExceptions,
  mockReviewResult,
};

export default exceptionService;
