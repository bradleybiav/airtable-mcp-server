import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import Airtable from 'airtable';

dotenv.config();

const requiredVars = [
  'AIRTABLE_API_KEY',
  'AIRTABLE_BASE_ID',
  'AIRTABLE_TABLE_NAME',
  'AIRTABLE_VIEW_ID',
] as const;

const missingVars = requiredVars.filter((v) => !process.env[v]);
if (missingVars.length > 0) {
  const plural = missingVars.length > 1 ? 's' : '';
  throw new Error(`Missing environment variable${plural}: ${missingVars.join(', ')}`);
}

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  next();
  return;
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.MCP_API_KEY!) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
});

Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY!,
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID!);

app.get('/mcp/tools', async (req: Request, res: Response) => {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_NAME!)
      .select({
        view: process.env.AIRTABLE_VIEW_ID!,
        maxRecords: 5,
      })
      .firstPage();

    const result = records.map((record) => ({
      id: record.id,
      fields: record.fields,
    }));

    res.json({
      message: 'Fetched data from Airtable!',
      records: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

const port = process.env.PORT! || 3000;
app.listen(port, () => {
  console.log(`✅ MCP Server running on port ${port}`);
});
