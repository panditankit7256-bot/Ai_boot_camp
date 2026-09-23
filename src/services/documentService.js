import api from './api';
import {
  mockDocuments,
  mockDocumentDetail,
  mockUploadResult,
  mockReprocessResult,
} from '../mocks/mockData';

export async function getDocuments(params = {}) {
  const { page = 1, page_size = 20, search = '', status = '', hospital = '', exception_type = '', source_type = '', vector_status = '' } = params;
  const res = await api.get('/api/v1/documents', {
    params: { page, page_size, search, status, hospital, exception_type, source_type, vector_status },
  });
  return res.data;
}

export async function getDocumentById(documentId) {
  const res = await api.get(`/api/v1/documents/${documentId}`);
  return res.data;
}

export async function uploadDocuments(files, onProgress) {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  const res = await api.post('/api/v1/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress,
  });
  return res.data;
}

export async function reprocessDocument(documentId) {
  const res = await api.post(`/api/v1/documents/${documentId}/reprocess`);
  return res.data;
}

const documentService = {
  getDocuments,
  getDocumentById,
  uploadDocuments,
  reprocessDocument,
  mockDocuments,
  mockDocumentDetail,
  mockUploadResult,
  mockReprocessResult,
};

export default documentService;
