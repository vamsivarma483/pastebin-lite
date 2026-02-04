'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPaste } from '@/lib/api';

interface PasteData {
  content: string;
  remaining_views: number | null;
  expires_at: string | null;
}

export default function ViewPaste({ params }: { params: Promise<{ id: string }> }) {
  const [paste, setPaste] = useState<PasteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [id, setId] = useState<string>('');

  useEffect(() => {
    params.then(({ id }) => {
      setId(id);
      fetchPaste(id);
    });
  }, [params]);

  const fetchPaste = async (pasteId: string) => {
    try {
      const data = await getPaste(pasteId);
      if (!data) {
        setError('Paste not found or has expired.');
        setPaste(null);
      } else {
        setPaste(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load paste');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error || !paste) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-2xl mx-auto mt-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4 inline-block"
          >
            ← Back to Create
          </Link>
          <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg mt-4">
            <h2 className="font-semibold mb-2">Paste Not Found</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const expiresAt = paste.expires_at ? new Date(paste.expires_at).toLocaleString() : 'Never';
  const remainingViews =
    paste.remaining_views !== null
      ? `${paste.remaining_views} remaining`
      : 'Unlimited';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4 inline-block"
        >
          ← Back to Create
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-4">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Paste: {id}
            </h1>
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Expires At:</p>
                <p className="font-semibold text-gray-900 dark:text-white">{expiresAt}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Views:</p>
                <p className="font-semibold text-gray-900 dark:text-white">{remainingViews}</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content:
            </label>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded border border-gray-200 dark:border-gray-600 overflow-auto max-h-96">
              <pre className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
                {paste.content}
              </pre>
            </div>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(paste.content);
              alert('Copied to clipboard!');
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Copy Content
          </button>
        </div>
      </div>
    </div>
  );
}
