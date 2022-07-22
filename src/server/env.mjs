// @ts-check
/**
 * This file is included in `/next.config.mjs` which ensures the app isn't built with invalid env vars.
 * It has to be a `.mjs`-file to be imported there.
 */
import { envSchema } from './env-schema.mjs';

const parsedEnv = envSchema.safeParse(process.env);

const formatErrors = (
  /** @type {import('zod').ZodFormattedError<Map<string,string>,string>} */
  errors,
) => Object.entries(errors)
  .map(([name, value]) => {
    // eslint-disable-next-line no-underscore-dangle
    if (value && '_errors' in value) return `${name}: ${value._errors.join(', ')}\n`;
    return undefined;
  })
  .filter(Boolean);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:\n', ...formatErrors(parsedEnv.error.format()));
  process.exit(1);
}

export const env = parsedEnv.data;
