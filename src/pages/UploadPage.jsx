import { useState, useRef, useCallback } from 'react';
import { UploadCloud, FileText, X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import documentService from '../services/documentService';
import { USE_MOCKS } from '../config/apiConfig';
import { mockUploadResult } from '../mocks/mockData';

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = useCallback((fileList) => {
    const pdfs = Array.from(fileList).filter((f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    const rejected = Array.from(fileList).length - pdfs.length;
    setSelectedFiles(pdfs);
    setResult(null);
    setError(null);
    if (rejected > 0) {
      setError(`${rejected} non-PDF file(s) were rejected. Only PDF files are accepted.`);
    }
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const onFilePick = (e) => {
    handleFiles(e.target.files);
  };

  const removeFile = (idx) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    setProgress(0);
    setError(null);
    setResult(null);
    try {
      if (USE_MOCKS) {
        await new Promise((r) => setTimeout(r, 1200));
        setResult(mockUploadResult);
        setProgress(100);
      } else {
        const res = await documentService.uploadDocuments(selectedFiles, (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
        });
        setResult(res);
      }
      setSelectedFiles([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-semibold text-navy-800">Upload Documents</h2>
        <p className="text-sm text-slate-500">Upload one or more PDF invoices for processing.</p>
      </div>

      <div className="card p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Use synthetic documents only.</p>
            <p className="mt-1">Each upload is automatically extracted, OCR-processed when needed, validated, stored, chunked and indexed — no manual steps required.</p>
          </div>
        </div>
      </div>

      <div
        className={`card border-2 border-dashed p-8 text-center transition-colors ${
          dragOver ? 'border-brand-500 bg-brand-50' : 'border-slate-300'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <p className="text-sm text-slate-600">Drag and drop PDF files here, or</p>
        <button
          className="btn btn-primary mt-3"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          Browse Files
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          className="hidden"
          onChange={onFilePick}
        />
        <p className="text-xs text-slate-400 mt-2">Only PDF files are accepted</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-navy-800 mb-3">Selected Files ({selectedFiles.length})</h3>
          <ul className="space-y-2">
            {selectedFiles.map((file, idx) => (
              <li key={idx} className="flex items-center justify-between text-sm border-b border-slate-100 pb-2">
                <span className="flex items-center gap-2 text-slate-700">
                  <FileText className="w-4 h-4 text-brand-600" />
                  {file.name}
                  <span className="text-slate-400 text-xs">({(file.size / 1024).toFixed(0)} KB)</span>
                </span>
                {!uploading && (
                  <button onClick={() => removeFile(idx)} className="text-slate-400 hover:text-red-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>
          {uploading && (
            <div className="mt-4">
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-brand-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-slate-500 mt-1 text-center">Uploading... {progress}%</p>
            </div>
          )}
          {!uploading && (
            <button className="btn btn-primary mt-4 w-full" onClick={handleUpload}>
              Upload {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}
            </button>
          )}
        </div>
      )}

      {result && (
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-navy-800 mb-3">Upload Results</h3>
          <div className="grid grid-cols-3 gap-3 text-center text-sm mb-4">
            <div><p className="text-slate-500 text-xs">Uploaded</p><p className="font-bold text-blue-700">{result.uploaded ?? result.results?.length}</p></div>
            <div><p className="text-slate-500 text-xs">Succeeded</p><p className="font-bold text-green-700">{result.succeeded ?? result.results?.filter(r => r.status === 'PROCESSED').length}</p></div>
            <div><p className="text-slate-500 text-xs">Failed</p><p className="font-bold text-red-700">{result.failed ?? result.results?.filter(r => r.status === 'FAILED').length}</p></div>
          </div>
          <ul className="space-y-2">
            {result.results?.map((r, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm border-b border-slate-100 pb-2">
                {r.status === 'PROCESSED' ? (
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-slate-800 font-medium">{r.file_name}</p>
                  <p className="text-slate-500 text-xs">{r.message}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
