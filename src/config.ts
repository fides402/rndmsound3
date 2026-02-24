const rawUrl: string = import.meta.env.VITE_API_BASE_URL || '';
export const API_BASE_URL: string = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
