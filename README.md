# AgentForge AI Document Ops

Operations console for processing synthetic hospital invoice PDFs. The React frontend provides dashboard, upload, bulk ingestion, document review, exception management, cited Q&A and analytics. A separate FastAPI backend (not included here) provides every API endpoint.

## Tech Stack

- **React 18** (JavaScript, JSX)
- **Vite** build tool
- **React Router** for routing
- **Axios** for HTTP requests
- **Tailwind CSS** for styling
- **Recharts** for charts
- **Lucide React** for icons

## Getting Started

```bash
npm install
npm run dev
```

The UI runs in mock mode by default (`VITE_USE_MOCKS=true`), so it works without the backend.

## Environment Variables

Copy `.env.example` to `.env` and adjust:

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000` | FastAPI backend URL |
| `VITE_USE_MOCKS` | `true` | Use mock data when backend is not ready |

## Routes

| Route | Page |
|---|---|
| `/` | Dashboard — KPIs, recent documents, charts |
| `/upload` | Upload — drag-and-drop PDF upload |
| `/knowledge-base` | Knowledge Base — bulk ingestion, index stats, reindex |
| `/documents` | Documents — searchable, filterable document list |
| `/documents/:documentId` | Document Detail — invoice fields, line items, validation, audit trail |
| `/exceptions` | Exceptions — review queue with correction panel |
| `/chat` | Ask Invoices — cited Q&A over indexed invoices |
| `/analytics` | Analytics — KPIs, trends, charts, Excel export |

## Service Layer

All API calls go through named service functions — pages never call Axios directly.

| File | Exports |
|---|---|
| `src/config/apiConfig.js` | `API_BASE_URL`, `USE_MOCKS` |
| `src/services/api.js` | Shared Axios instance |
| `src/services/documentService.js` | `getDocuments`, `getDocumentById`, `uploadDocuments`, `reprocessDocument` |
| `src/services/ingestionService.js` | `startBulkIngestion`, `getIngestionJob`, `getIngestionStats`, `reindexDocument` |
| `src/services/exceptionService.js` | `getExceptions`, `reviewException` |
| `src/services/chatService.js` | `sendChatQuery` |
| `src/services/analyticsService.js` | `getAnalyticsSummary`, `getAnalyticsTrends`, `getExportUrl` |

## API Contract

The frontend expects these FastAPI endpoints:

- `GET /api/v1/health`
- `POST /api/v1/documents/upload` (multipart/form-data, field `files`)
- `GET /api/v1/documents?page=1&page_size=20&search=&status=&hospital=&exception_type=`
- `GET /api/v1/documents/{documentId}`
- `POST /api/v1/documents/{documentId}/reprocess`
- `POST /api/v1/ingestion/bulk` (JSON `{"recursive": true}`)
- `GET /api/v1/ingestion/jobs/{jobId}`
- `GET /api/v1/ingestion/stats`
- `POST /api/v1/ingestion/reindex/{documentId}`
- `GET /api/v1/exceptions?page=1&page_size=20&status=OPEN&type=`
- `PATCH /api/v1/exceptions/{exceptionId}/review`
- `POST /api/v1/chat/query`
- `GET /api/v1/analytics/summary`
- `GET /api/v1/analytics/trends`
- `GET /api/v1/exports/invoices.xlsx`

## Backend Skeleton

The `backend/` folder contains placeholder directories for the FastAPI implementation:

```
backend/
  apis/              # API route handlers
  services/          # Business logic (extraction, OCR, validation, chunking, embedding)
  database/sql/      # SQL Server schema scripts
  data/samples/      # Sample synthetic PDFs
  data/source_invoices/  # ~18,000 existing PDFs (gitignored)
  data/uploads/      # UI-uploaded PDFs (gitignored)
  vectorstore/chroma/    # Persistent Chroma vector store (gitignored)
  exports/           # Generated Excel exports (gitignored)
```

No Python business logic or SQL queries are included — those will be implemented from the bootcamp runbook in VS Code.

## Security Notes

- No secrets (Ollama API keys, SQL Server credentials) are placed in frontend code.
- The backend folder path for source invoices is configured in the backend `.env` file, not in the browser.
- All API calls use the URL from `VITE_API_BASE_URL`.

## Build

```bash
npm run build
```
