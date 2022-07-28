import { Question, QuestionOption } from '@prisma/client';
import { isToday, isYesterday } from 'date-fns';
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

const userRouter = t.router({
  getStats: t.procedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => ctx.prisma.triviaStats.findFirst({
      where: { userId: input.userId },
    })),
  addResult: t.procedure
    .input(z.object({ userId: z.string(), correctAnswers: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const stats = await ctx.prisma.triviaStats.findFirst({
        where: { userId: input.userId },
      });

      const streakIncrement = (input.correctAnswers && 1) || 0;
      const correctAnswersField = `correct_${input.correctAnswers}` as keyof typeof stats;
      if (!stats) {
        return ctx.prisma.triviaStats.create({
          data: {
            userId: input.userId,
            [correctAnswersField]: 1,
            streak: streakIncrement,
            maxStreak: streakIncrement,
            timesPlayed: 1,
            lastPlayed: new Date(),
          },
        });
      }

      if (isToday(stats.lastPlayed)) return; // Do not track the same user's stats if they play again
      const playedYesterday = isYesterday(stats.lastPlayed);
      const streak = playedYesterday && streakIncrement ? stats.streak + streakIncrement : streakIncrement;
      return ctx.prisma.triviaStats.update({
        where: { userId: input.userId },
        data: {
          [correctAnswersField]: stats[correctAnswersField] + 1,
          streak,
          maxStreak: Math.max(streak, stats.maxStreak),
          timesPlayed: stats.timesPlayed + 1,
          lastPlayed: new Date(),
        },
      });
    }),
});

export const triviaRouter = t.router({
  question: questionRouter,
  user: userRouter,
});
