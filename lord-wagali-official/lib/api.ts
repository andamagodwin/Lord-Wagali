const RAW_API_URL = process.env.EXPO_PUBLIC_API_URL?.trim() || 'http://localhost:4000';

export const API_BASE_URL = RAW_API_URL.replace(/\/$/, '');
export const ADMIN_API_KEY = process.env.EXPO_PUBLIC_ADMIN_API_KEY?.trim() || '';

type ApiRequestOptions = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>;
  admin?: boolean;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = payload?.error || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload as T;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (options.admin && ADMIN_API_KEY) {
    headers['x-admin-key'] = ADMIN_API_KEY;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  return parseResponse<T>(response);
}
