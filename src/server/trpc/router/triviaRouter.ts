import { Question, QuestionOption } from '@prisma/client';
import { isToday, isYesterday } from 'date-fns';
import { z } from 'zod';
import TriviaClient from '../../../http/TriviaClient';
import { t } from '../utils';

const triviaClient = new TriviaClient();
export type IQuestion = Question & { options: QuestionOption[] };

const questionOptionSchema = z.object({
  id: z.string(),
  questionId: z.string(),
  value: z.string(),
  isCorrect: z.boolean(),
});

const questionSchema = z.object({
  id: z.string(),
  question: z.string(),
  difficulty: z.string().nullable(),
  category: z.string().nullable(),
  type: z.string().nullable(),
  insertedAt: z.date(),
  options: z.array(questionOptionSchema),
});

const answerSchema = z.object({
  answer: z.string(), isCorrect: z.boolean(), question: questionSchema,
});

const questionRouter = t.router({
  getAll: t.procedure.query(({ ctx }) => ctx.prisma.question.findMany()),
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
  submitAnswer: t.procedure
    .input(z.object({ answer: answerSchema, userId: z.string() }))
    .mutation(({ ctx, input }) => ctx.prisma.questionAnswer.create({
      data: {
        answer: input.answer.answer,
        isCorrect: input.answer.isCorrect,
        questionId: input.answer.question.id,
        userId: input.userId,
      },
    })),
});

const userRouter = t.router({
  getStats: t.procedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => ctx.prisma.triviaStats.findFirst({
      where: { userId: input.userId },
    })),
  getAnswers: t.procedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => ctx.prisma.questionAnswer.findMany({
      where: { userId: input.userId },
      include: { question: true },
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
