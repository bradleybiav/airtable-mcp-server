import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

const app = express();

app.get('/mcp/tools', (req, res) => {
  res.json({
    message: 'MCP server is alive!',
    airtableBase: process.env.AIRTABLE_BASE_ID,
    tableName: process.env.AIRTABLE_TABLE_NAME,
    viewId: process.env.AIRTABLE_VIEW_ID,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ MCP Server running on port ${port}`);
});
