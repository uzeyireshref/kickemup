export const DEFAULT_AUTH_REDIRECT_PATH = '/';

const BLOCKED_REDIRECT_PREFIXES = ['/login', '/register', '/auth/callback'];

export const sanitizeAuthRedirectPath = (value?: string | null) => {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return DEFAULT_AUTH_REDIRECT_PATH;
  }

  if (BLOCKED_REDIRECT_PREFIXES.some((prefix) => value === prefix || value.startsWith(`${prefix}?`))) {
    return DEFAULT_AUTH_REDIRECT_PATH;
  }

  return value;
};

export const buildAuthCallbackUrl = (next?: string | null) => {
  if (typeof window === 'undefined') {
    return '/auth/callback';
  }

  const url = new URL('/auth/callback', window.location.origin);
  url.searchParams.set('next', sanitizeAuthRedirectPath(next));
  return url.toString();
};

export const readAuthMetadataString = (
  metadata: Record<string, unknown>,
  ...keys: string[]
) => {
  for (const key of keys) {
    const value = metadata[key];

    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return '';
};
