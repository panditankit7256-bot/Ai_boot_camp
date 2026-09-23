import { useEffect, useState, useRef } from 'react';
import { Send, MessageSquareText, Info } from 'lucide-react';
import chatService from '../services/chatService';
import { USE_MOCKS } from '../config/apiConfig';
import { mockChatResponse } from '../mocks/mockData';
import ChatMessage from '../components/chat/ChatMessage';
import CitationCard from '../components/chat/CitationCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setLoading(true);

    try {
      let response;
      if (USE_MOCKS) {
        await new Promise((r) => setTimeout(r, 800));
        response = {
          ...mockChatResponse,
          answer: mockChatResponse.answer.replace('INV-100001', question.includes('total') ? 'INV-100001' : 'INV-100001'),
        };
      } else {
        response = await chatService.sendChatQuery(question);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.answer || 'I could not find enough evidence to answer this question.',
          citations: response.citations || [],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Error: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div>
        <h2 className="text-lg font-semibold text-navy-800">Ask Invoices</h2>
        <p className="text-sm text-slate-500">Ask questions about indexed invoices with cited answers.</p>
      </div>

      <div className="card p-3 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            Search covers every successfully indexed PDF from both the bulk folder and UI uploads. Answers include citations with invoice number, document ID, page number, file name, chunk ID and a link to the full document.
          </p>
        </div>
      </div>

      <div className="card p-4 flex-1 flex flex-col min-h-[400px]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <MessageSquareText className="w-12 h-12 mb-3" />
              <p className="text-sm">Ask a question about your invoices to get started.</p>
              <p className="text-xs mt-1">e.g. "What is the total for INV-100001?"</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} />
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-lg px-4 py-3">
                <LoadingSpinner label="Searching indexed documents..." />
              </div>
            </div>
          )}
        </div>

        {messages.some(m => m.citations?.length > 0) && (
          <div className="mb-4">
            <p className="text-xs font-medium text-slate-500 mb-2">Latest Citations:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {messages[messages.length - 1]?.citations?.map((citation, idx) => (
                <CitationCard key={idx} citation={citation} />
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="Ask a question about your invoices..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
