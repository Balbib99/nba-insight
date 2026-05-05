export const API_BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:4000').replace(/\/$/, '');

export type DataMode = 'mock' | 'api' | 'hybrid';

const rawDataMode = import.meta.env.VITE_DATA_MODE;

export const DATA_MODE: DataMode =
  rawDataMode === 'mock' || rawDataMode === 'api' || rawDataMode === 'hybrid' ? rawDataMode : 'hybrid';

export const isMockMode = DATA_MODE === 'mock';
export const isApiMode = DATA_MODE === 'api';
export const isHybridMode = DATA_MODE === 'hybrid';
