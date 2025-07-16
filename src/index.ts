import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import Airtable from 'airtable';

dotenv.config();

const {
  AIRTABLE_API_KEY,
  AIRTABLE_BASE_ID,
  AIRTABLE_TABLE_NAME,
  AIRTABLE_VIEW_ID,
  MCP_API_KEY,
  PORT,
  VITEST,
} = process.env;

if (!AIRTABLE_API_KEY) throw new Error('Missing AIRTABLE_API_KEY');
if (!AIRTABLE_BASE_ID) throw new Error('Missing AIRTABLE_BASE_ID');
if (!AIRTABLE_TABLE_NAME) throw new Error('Missing AIRTABLE_TABLE_NAME');
if (!AIRTABLE_VIEW_ID) throw new Error('Missing AIRTABLE_VIEW_ID');

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  if (MCP_API_KEY) {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== MCP_API_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }
  return next();
});

Airtable.configure({
  apiKey: AIRTABLE_API_KEY,
});

const base = Airtable.base(AIRTABLE_BASE_ID);

app.get('/mcp/tools', async (req: Request, res: Response) => {
  try {
    const records = await base(AIRTABLE_TABLE_NAME)
      .select({
        view: AIRTABLE_VIEW_ID,
        maxRecords: 5,
      })
      .firstPage();

    const result = records.map((record) => ({
      id: record.id,
      fields: record.fields
    }));

    res.json({
      message: 'Fetched data from Airtable!',
      records: result
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

if (!VITEST) {
  const port = Number(PORT) || 3000;
  app.listen(port, () => {
    console.log(`✅ MCP Server running on port ${port}`);
  });
}

export default app;
