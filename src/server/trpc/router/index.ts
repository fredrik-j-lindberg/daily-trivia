// src/server/trpc/router/index.ts
import { t } from '../utils';
import { authRouter } from './auth';
import { triviaRouter } from './triviaRouter';

export const appRouter = t.router({
  auth: authRouter,
  trivia: triviaRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
