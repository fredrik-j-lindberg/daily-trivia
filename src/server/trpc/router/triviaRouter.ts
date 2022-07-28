import { Question, QuestionOption } from '@prisma/client';
import { z } from 'zod';
import TriviaClient from '../../../http/TriviaClient';
import { t } from '../utils';

const triviaClient = new TriviaClient();
export type IQuestion = Question & { options: QuestionOption[] };

const questionRouter = t.router({
  get: t.procedure
    .input(z.object({
      difficulty: z.union([z.string(), z.undefined()]),
      category: z.union([z.string(), z.undefined()]),
      questionIndex: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      // Use external db source but hydrate own store for future use
      // return ctx.prisma.question.findFirst({ skip: Math.floor(Math.random() * 15), include: { options: true } });
      const questionData = await triviaClient.getQuestion(input.difficulty, input.category);
      const { options, ...questionModel } = questionData;

      return ctx.prisma.question.upsert({
        where: { question: questionModel.question },
        update: {}, // Ignore updating question if it already exists
        create: {
          ...questionModel,
          options: { create: options },
        },
        include: {
          options: true,
        },
      });
    }),
});

export const triviaRouter = t.router({
  question: questionRouter,
});
