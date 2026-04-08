const browserApi = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const serverApi = process.env.INTERNAL_API_URL || 'http://backend:8000/api/v1';

export const API_URL = (typeof window === 'undefined' ? serverApi : browserApi).replace(/\/$/, '');

function buildUrl(path: string) {
  return path.startsWith('http') ? path : `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export class ApiError extends Error {
  status: number;
  body: string;
  constructor(message: string, status: number, body: string) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  let res: Response;

  try {
    res = await fetch(buildUrl(path), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      cache: 'no-store',
    });
  } catch {
    throw new ApiError(
      'Unable to reach the API. Make sure Docker is running, the backend container is healthy, and your API URL settings are correct.',
      0,
      '',
    );
  }

  const text = await res.text();
  if (!res.ok) {
    throw new ApiError(text || 'Request failed', res.status, text);
  }
  return text ? JSON.parse(text) : ({} as T);
}
