import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

const envFilePath = fileURLToPath(new URL('./.env', import.meta.url));
const envResult = dotenv.config({ path: envFilePath });

if (envResult.error && envResult.error.code !== 'ENOENT') {
  throw envResult.error;
}

if (!envResult.error || envResult.parsed) {
  dotenvExpand(envResult);
}
