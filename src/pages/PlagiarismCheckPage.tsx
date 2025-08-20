import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UploadCloud, FileCode2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

type CheckMode = 'file' | 'github';

export const PlagiarismCheckPage: React.FC = () => {
  const { handleSubmit } = useForm();
  const [mode, setMode] = useState<CheckMode>('file');
  const [file, setFile] = useState<File | null>(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<null | { similarity: number; matches: Array<{ source: string; percent: number }> }>(null);
  const [error, setError] = useState<string | null>(null);
  const pollTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (pollTimer.current) {
        window.clearInterval(pollTimer.current);
        pollTimer.current = null;
      }
    };
  }, []);

  const onSubmit = async () => {
    setError(null);
    setResult(null);
    setIsChecking(true);
    try {
      const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5001';
      const token = localStorage.getItem('auth_token') || '';

      let scanId = '';
      if (mode === 'file') {
        if (!file) throw new Error('Please select a file.');
        const form = new FormData();
        form.append('file', file);
        const resp = await fetch(`${API_BASE}/api/plagiarism/check`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: form
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data?.error || 'Submission failed');
        scanId = data.scanId;
      } else {
        const resp = await fetch(`${API_BASE}/api/plagiarism/check`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ githubUrl })
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data?.error || 'Submission failed');
        scanId = data.scanId;
      }

      const poll = async () => {
        const r = await fetch(`${API_BASE}/api/plagiarism/result/${encodeURIComponent(scanId)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (r.status === 202) {
          return; // still processing
        }
        const body = await r.json();
        if (!r.ok) throw new Error(body?.error || 'Failed to fetch result');
        setResult({ similarity: Number(body.similarity) || 0, matches: body.matches || [] });
        if (pollTimer.current) {
          window.clearInterval(pollTimer.current);
          pollTimer.current = null;
        }
        setIsChecking(false);
      };

      await poll();
      pollTimer.current = window.setInterval(poll, 2000);
    } catch (e) {
      setError('Failed to check plagiarism. Please try again.');
      setIsChecking(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">Plagiarism Check</h1>
        <p className="text-gray-600">Upload your source code or provide a GitHub repo URL to estimate similarity against public sources.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Run a Check</CardTitle>
          <CardDescription>Only participants can access this page. No code is stored; it’s used transiently for analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center gap-2 bg-gray-100 w-fit p-1 rounded-lg">
              <button type="button" className={`px-3 py-1 rounded-md text-sm ${mode === 'file' ? 'bg-white shadow' : ''}`} onClick={() => setMode('file')}>Upload File/Zip</button>
              <button type="button" className={`px-3 py-1 rounded-md text-sm ${mode === 'github' ? 'bg-white shadow' : ''}`} onClick={() => setMode('github')}>GitHub Repo</button>
            </div>

            {mode === 'file' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Source code archive</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <UploadCloud className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-3">Drag and drop your .zip or select a file</p>
                  <input
                    type="file"
                    accept=".zip,.tar,.gz,.tgz,.rar,.7z,.py,.js,.ts,.java,.cpp,.c,.cs"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  {file && (
                    <div className="mt-3 inline-flex items-center gap-2 text-sm text-gray-700">
                      <FileCode2 className="h-4 w-4" />
                      <span>{file.name}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Public GitHub repository URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/username/repo"
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                />
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={isChecking || (mode === 'file' ? !file : !githubUrl)}>
                {isChecking ? (
                  <span className="inline-flex items-center"><Loader2 className="h-4 w-4 mr-2 animate-spin" />Checking…</span>
                ) : (
                  'Check Plagiarism'
                )}
              </Button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">{error}</div>
          )}

          {result && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Estimated Similarity</h3>
              <div className="p-4 border rounded-lg">
                <p className="text-2xl font-bold text-primary-600">{result.similarity.toFixed(1)}%</p>
                <p className="text-gray-600 mb-3">Lower is better. Investigate matches below.</p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  {result.matches.map((m, i) => (
                    <li key={i}>{m.source} — {m.percent}%</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlagiarismCheckPage;


