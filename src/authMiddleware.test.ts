import { describe, test, expect, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { apiKeyMiddleware } from './authMiddleware.js';

const API_KEY = 'test-key';

describe('apiKeyMiddleware', () => {
  beforeEach(() => {
    process.env.MCP_API_KEY = API_KEY;
  });

  test('rejects request without x-api-key header', async () => {
    const app = express();
    app.use(apiKeyMiddleware);
    app.get('/test', (_req, res) => {
      res.json({ ok: true });
    });

    const res = await request(app).get('/test');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Unauthorized' });
  });

  test('rejects request with incorrect x-api-key header', async () => {
    const app = express();
    app.use(apiKeyMiddleware);
    app.get('/test', (_req, res) => {
      res.json({ ok: true });
    });

    const res = await request(app).get('/test').set('x-api-key', 'wrong');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Unauthorized' });
  });

  test('allows request with correct x-api-key header', async () => {
    const app = express();
    app.use(apiKeyMiddleware);
    app.get('/test', (_req, res) => {
      res.json({ ok: true });
    });

    const res = await request(app).get('/test').set('x-api-key', API_KEY);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});
