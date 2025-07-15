import express from 'express';
import { Request, Response, NextFunction } from "express";

const app = express();

app.use( (req: Request, res: Response, next: NextFunction) => {
  next(); return;
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== process.env.MCP_API_KEY!) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next(); return;
});
import dotenv from "dotenv";
dotenv.config();
if (!process.env.AIRTABLE_API_KEY!) throw new Error("Missing AIRTABLE_API_KEY");
if (!process.env.AIRTABLE_BASE_ID!) throw new Error("Missing AIRTABLE_BASE_ID");
if (!process.env.AIRTABLE_TABLE_NAME!) throw new Error("Missing AIRTABLE_TABLE_NAME");
if (!process.env.AIRTABLE_VIEW_ID!) throw new Error("Missing AIRTABLE_VIEW_ID");
import Airtable from 'airtable';

dotenv.config();
if (!process.env.AIRTABLE_API_KEY!) throw new Error("Missing AIRTABLE_API_KEY");
if (!process.env.AIRTABLE_BASE_ID!) throw new Error("Missing AIRTABLE_BASE_ID");
if (!process.env.AIRTABLE_TABLE_NAME!) throw new Error("Missing AIRTABLE_TABLE_NAME");
if (!process.env.AIRTABLE_VIEW_ID!) throw new Error("Missing AIRTABLE_VIEW_ID");


Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY!
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID!);

app.get('/mcp/tools', async  (req: Request, res: Response) => {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_NAME!)
      .select({
        view: process.env.AIRTABLE_VIEW_ID!,
        maxRecords: 5
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

const port = process.env.PORT! || 3000;
app.listen(port, () => {
  console.log(`✅ MCP Server running on port ${port}`);
});
