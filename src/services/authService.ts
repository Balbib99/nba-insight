import { API_BASE_URL } from '../config/api';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isAuthUser(value: unknown): value is AuthUser {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    typeof value.name === 'string' &&
    typeof value.email === 'string'
  );
}

function isAuthResponse(value: unknown): value is AuthResponse {
  return isRecord(value) && isAuthUser(value.user) && typeof value.token === 'string';
}

function isMeResponse(value: unknown): value is { user: AuthUser } {
  return isRecord(value) && isAuthUser(value.user);
}

function cleanErrorMessage(value: unknown, fallback: string): string {
  if (!isRecord(value)) {
    return fallback;
  }

  const rawMessage =
    typeof value.message === 'string' ? value.message : typeof value.error === 'string' ? value.error : undefined;

  if (!rawMessage || rawMessage.length > 180 || rawMessage.includes('\n') || rawMessage.includes(' at ')) {
    return fallback;
  }

  return rawMessage;
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

async function requestAuth<T>(
  endpoint: string,
  options: RequestInit,
  validate: (value: unknown) => value is T,
  fallbackError: string,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  } catch (error) {
    throw new Error('Could not reach the NBA Insight API. Please try again.', { cause: error });
  }

  const json = await readJson(response);

  if (!response.ok) {
    throw new Error(cleanErrorMessage(json, fallbackError));
  }

  if (!validate(json)) {
    throw new Error('The NBA Insight API returned an unexpected auth response.');
  }

  return json;
}

export function login(email: string, password: string): Promise<AuthResponse> {
  return requestAuth<AuthResponse>(
    '/api/auth/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    },
    isAuthResponse,
    'Login failed. Please check your email and password.',
  );
}

export function register(name: string, email: string, password: string): Promise<AuthResponse> {
  return requestAuth<AuthResponse>(
    '/api/auth/register',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    },
    isAuthResponse,
    'Registration failed. Please check your details and try again.',
  );
}

export function getMe(token: string): Promise<{ user: AuthUser }> {
  return requestAuth<{ user: AuthUser }>(
    '/api/auth/me',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    isMeResponse,
    'Your session has expired. Please sign in again.',
  );
}
