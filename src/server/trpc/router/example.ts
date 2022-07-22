import { z } from 'zod';
import { t } from '../utils';

export const exampleRouter = t.router({
  hello: t.procedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => ({
      greeting: `Hello ${input?.text ?? 'world'}`,
    })),
  getAll: t.procedure.query(({ ctx }) => ctx.prisma.example.findMany()),
});
