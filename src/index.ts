#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { AirtableService } from './airtableService.js';
import { AirtableMCPServer } from './mcpServer.js';

const main = async () => {
  const cliApiKey = process.argv[2];
  const apiKey = cliApiKey || process.env.AIRTABLE_API_KEY;

  if (!apiKey) {
    console.error('airtable-mcp-server: No API key provided. Pass it as the first command-line argument or set the AIRTABLE_API_KEY environment variable.');
    process.exit(1);
    return;
  }

  if (cliApiKey) {
    // Deprecation warning for tests that still pass the key via argv
    console.warn(
      'warning (airtable-mcp-server): Passing in an API key as a command-line argument is deprecated. Set the AIRTABLE_API_KEY environment variable instead.'
    );
  }

  const airtableService = new AirtableService(apiKey);
  const server = new AirtableMCPServer(airtableService);
  const transport = new StdioServerTransport();
  await server.connect(transport);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
