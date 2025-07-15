import express from 'express';
import dotenv from 'dotenv';
import Airtable from 'airtable';

dotenv.config();

const app = express();

Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

app.get('/mcp/tools', async (req, res) => {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_NAME)
      .select({
        view: process.env.AIRTABLE_VIEW_NAME,
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
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ MCP Server running on port ${port}`);
});
