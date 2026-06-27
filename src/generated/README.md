# Generated API Typings

> [!WARNING]
> DO NOT edit files in this directory manually. Any custom changes will be overwritten.

This directory contains the auto-generated types from the backend's OpenAPI/Swagger specification.

## Configuration

The type generator writes directly to:
- `src/generated/openapi.ts`

## Workflow

1. Backend changes API schemas or endpoints.
2. Run the synchronization script:
   ```bash
   bun run generate-path
   ```
3. Type-check validation occurs automatically to guarantee the frontend code matches the new backend contract:
   ```bash
   bun run sync-api
   ```
