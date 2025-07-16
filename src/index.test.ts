import { describe, test, expect, vi, afterEach } from 'vitest';

// Ensure fresh module each time
afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('index entry', () => {
  test('throws when required env vars are missing', async () => {
    vi.stubEnv('VITEST', 'true');
    await expect(import('./index.js')).rejects.toThrow('Missing AIRTABLE_API_KEY');
  });

  test('loads with provided env vars', async () => {
    vi.stubEnv('VITEST', 'true');
    vi.stubEnv('AIRTABLE_API_KEY', 'key');
    vi.stubEnv('AIRTABLE_BASE_ID', 'base');
    vi.stubEnv('AIRTABLE_TABLE_NAME', 'table');
    vi.stubEnv('AIRTABLE_VIEW_ID', 'view');

    const mod = await import('./index.js');
    expect(mod.default).toBeDefined();
  });
});
