import api from './api';
import { mockChatResponse } from '../mocks/mockData';

export async function sendChatQuery(question) {
  const res = await api.post('/api/v1/chat/query', { question });
  return res.data;
}

const chatService = {
  sendChatQuery,
  mockChatResponse,
};

export default chatService;
