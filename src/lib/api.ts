import { API_URL } from '../config';

export async function apiRequest<T>(
  path: string,
  method?: string,
  body?: unknown,
  onLive?: (live: boolean) => void,
): Promise<T | null> {
  if (!API_URL.startsWith('http')) return null;
  try {
    const r = await fetch(API_URL.replace(/\/$/, '') + path, {
      method: method || 'GET',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!r.ok) throw new Error(String(r.status));
    onLive?.(true);
    return (await r.json()) as T;
  } catch {
    onLive?.(false);
    return null;
  }
}
