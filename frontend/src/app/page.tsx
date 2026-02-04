'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPaste } from '@/lib/api';

export default function Home() {
  const [content, setContent] = useState('');
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [maxViews, setMaxViews] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const calculateTtlSeconds = (): number | undefined => {
    const total = hours * 3600 + minutes * 60 + seconds;
    return total > 0 ? total : undefined;
  };

  const incrementHours = () => setHours(prev => (prev + 1) % 24);
  const decrementHours = () => setHours(prev => (prev - 1 + 24) % 24);
  
  const incrementMinutes = () => setMinutes(prev => (prev + 1) % 60);
  const decrementMinutes = () => setMinutes(prev => (prev - 1 + 60) % 60);
  
  const incrementSeconds = () => setSeconds(prev => (prev + 1) % 60);
  const decrementSeconds = () => setSeconds(prev => (prev - 1 + 60) % 60);

  const handleHoursInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(23, Math.max(0, parseInt(e.target.value) || 0));
    setHours(val);
  };

  const handleMinutesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));
    setMinutes(val);
  };

  const handleSecondsInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));
    setSeconds(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await createPaste(
        content,
        calculateTtlSeconds(),
        maxViews ? parseInt(maxViews, 10) : undefined,
      );
      router.push(`/p/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create paste');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 mt-8">
          Pastebin Lite
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Create and share text pastes with optional expiry and view limits.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Paste Content *
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your text here..."
              className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Expiry Time</span>
            </div>
            
            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-4 justify-center">
              {/* Hours */}
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={incrementHours}
                  className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition font-bold text-xl"
                >
                  +
                </button>
                <input
                  type="number"
                  value={String(hours).padStart(2, '0')}
                  onChange={handleHoursInput}
                  min="0"
                  max="23"
                  className="w-16 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center font-mono text-2xl font-bold"
                />
                <button
                  type="button"
                  onClick={decrementHours}
                  className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition font-bold text-xl"
                >
                  −
                </button>
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Hours</span>
              </div>

              <span className="text-3xl font-bold text-gray-700 dark:text-gray-300">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={incrementMinutes}
                  className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition font-bold text-xl"
                >
                  +
                </button>
                <input
                  type="number"
                  value={String(minutes).padStart(2, '0')}
                  onChange={handleMinutesInput}
                  min="0"
                  max="59"
                  className="w-16 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center font-mono text-2xl font-bold"
                />
                <button
                  type="button"
                  onClick={decrementMinutes}
                  className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition font-bold text-xl"
                >
                  −
                </button>
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Minutes</span>
              </div>

              <span className="text-3xl font-bold text-gray-700 dark:text-gray-300">:</span>

              {/* Seconds */}
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={incrementSeconds}
                  className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition font-bold text-xl"
                >
                  +
                </button>
                <input
                  type="number"
                  value={String(seconds).padStart(2, '0')}
                  onChange={handleSecondsInput}
                  min="0"
                  max="59"
                  className="w-16 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center font-mono text-2xl font-bold"
                />
                <button
                  type="button"
                  onClick={decrementSeconds}
                  className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition font-bold text-xl"
                >
                  −
                </button>
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Seconds</span>
              </div>
            </div>

            <div>
              <label
                htmlFor="maxViews"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Max Views (Optional)
              </label>
              <input
                id="maxViews"
                type="number"
                min="1"
                value={maxViews}
                onChange={(e) => setMaxViews(e.target.value)}
                placeholder="Leave empty for unlimited"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            {loading ? 'Creating...' : 'Create Paste'}
          </button>
        </form>
      </div>
    </div>
  );
}
