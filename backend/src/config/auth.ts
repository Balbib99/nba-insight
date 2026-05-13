import { logger } from '../utils/logger.js';

const DEFAULT_JWT_SECRET = 'change_me_in_production';
const isProduction = process.env.NODE_ENV === 'production';

export const JWT_SECRET = process.env.JWT_SECRET ?? DEFAULT_JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';

if (isProduction && JWT_SECRET === DEFAULT_JWT_SECRET) {
  throw new Error('JWT_SECRET must be configured securely in production');
}

if (!isProduction && JWT_SECRET === DEFAULT_JWT_SECRET) {
  logger.warn('JWT_SECRET is using the development fallback. Set JWT_SECRET before production deploy.');
}
