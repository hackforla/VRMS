import { pathToFileURL } from 'node:url';

// Proof that backend TypeScript runs directly under Node's built-in type
// stripping (no build step). Run: node scripts/ts-smoke.ts
interface SmokeResult {
  ok: boolean;
  nodeVersion: string;
}

export function tsSmoke(): SmokeResult {
  return { ok: true, nodeVersion: process.version };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(JSON.stringify(tsSmoke()));
}
