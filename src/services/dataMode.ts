import { isApiMode, isMockMode } from '../config/api';

interface FetchWithFallbackOptions<T> {
  apiCall: () => Promise<T>;
  fallback: () => T | Promise<T>;
  context: string;
}

export async function fetchWithFallback<T>({
  apiCall,
  fallback,
  context,
}: FetchWithFallbackOptions<T>): Promise<T> {
  if (isMockMode) {
    return fallback();
  }

  if (isApiMode) {
    return apiCall();
  }

  try {
    return await apiCall();
  } catch (error) {
    console.warn(`[NBA Insight] ${context}: falling back to mock data`, error);
    return fallback();
  }
}
