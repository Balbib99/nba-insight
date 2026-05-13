import bcrypt from 'bcryptjs';
import { Router } from 'express';
import jwt, { type SignOptions } from 'jsonwebtoken';

import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/auth.js';
import { pool } from '../db/pool.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import type { AuthUser, JwtPayload } from '../types/auth.js';
import { logger } from '../utils/logger.js';

const router = Router();
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_SALT_ROUNDS = 12;

interface UserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' ? value.trim() : undefined;
}

function toAuthUser(row: Pick<UserRow, 'id' | 'name' | 'email'>): AuthUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
  };
}

function createToken(user: AuthUser): string {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
  };
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

function validateEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email);
}

router.post('/register', async (req, res) => {
  if (!isRecord(req.body)) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }

  const name = readString(req.body.name);
  const email = readString(req.body.email)?.toLowerCase();
  const password = readString(req.body.password);

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  try {
    const existingUser = await pool.query<{ id: number }>('SELECT id FROM users WHERE email = $1', [email]);

    if (existingUser.rowCount && existingUser.rowCount > 0) {
      return res.status(409).json({ error: 'Email is already registered' });
    }

    const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
    const insertedUser = await pool.query<UserRow>(
      `
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, password_hash
      `,
      [name, email, passwordHash],
    );
    const user = toAuthUser(insertedUser.rows[0]);

    return res.status(201).json({
      user,
      token: createToken(user),
    });
  } catch (error) {
    logger.error('Register error', error);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  if (!isRecord(req.body)) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const email = readString(req.body.email)?.toLowerCase();
  const password = readString(req.body.password);

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const userResult = await pool.query<UserRow>(
      'SELECT id, name, email, password_hash FROM users WHERE email = $1',
      [email],
    );
    const userRow = userResult.rows[0];

    if (!userRow) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, userRow.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = toAuthUser(userRow);

    return res.json({
      user,
      token: createToken(user),
    });
  } catch (error) {
    logger.error('Login error', error);
    return res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  if (!req.auth) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const userResult = await pool.query<Pick<UserRow, 'id' | 'name' | 'email'>>(
      'SELECT id, name, email FROM users WHERE id = $1',
      [req.auth.userId],
    );
    const userRow = userResult.rows[0];

    if (!userRow) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.json({
      user: toAuthUser(userRow),
    });
  } catch (error) {
    logger.error('Me endpoint error', error);
    return res.status(500).json({ error: 'Could not load authenticated user' });
  }
});

export default router;
