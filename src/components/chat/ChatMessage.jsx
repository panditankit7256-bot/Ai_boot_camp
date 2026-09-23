export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-3xl rounded-lg px-4 py-3 text-sm ${
          isUser
            ? 'bg-brand-600 text-white'
            : 'bg-white border border-slate-200 text-slate-800'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.citations && message.citations.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className={`text-xs font-medium ${isUser ? 'text-brand-100' : 'text-slate-500'}`}>Citations:</p>
            {message.citations.map((citation, idx) => (
              <div
                key={idx}
                className={`rounded-md p-2 text-xs ${
                  isUser ? 'bg-brand-500/30 text-white' : 'bg-slate-50 text-slate-700 border border-slate-100'
                }`}
              >
                <p><strong>Invoice:</strong> {citation.invoice_no} | <strong>Doc ID:</strong> {citation.document_id} | <strong>Page:</strong> {citation.page_number}</p>
                <p><strong>File:</strong> {citation.file_name} | <strong>Chunk:</strong> {citation.chunk_id}</p>
                <p className="mt-1 italic">"{citation.snippet}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
