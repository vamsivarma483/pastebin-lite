const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function createPaste(
  content: string,
  ttl_seconds?: number,
  max_views?: number,
) {
  const response = await fetch(`${API_BASE_URL}/api/pastes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
      ...(ttl_seconds && { ttl_seconds }),
      ...(max_views && { max_views }),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create paste');
  }

  return response.json();
}

export async function getPaste(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/pastes/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch paste');
  }

  return response.json();
}
