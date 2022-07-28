import { useState } from 'react';
import { UseQueryOptions } from 'react-query';
import { categories } from '../http/TriviaClient';
import { IQuestion } from '../server/trpc/router/triviaRouter';
import { trpc } from '../utils/trpc';

export type { IQuestion };
export type IAnswer = ReturnType<typeof buildAnswerObject>;
const buildAnswerObject = (question: IQuestion, answer: string, isCorrect: boolean) => ({
  answer,
  isCorrect,
  question,
});

interface IUseTriviaQuestionProps {
  /** omitted = random */
  difficulty?: string;
  category?: string;
  questionIndex: number;
  gameLength: number;
}
const useDailyTrivia = (options: IUseTriviaQuestionProps) => {
  const [answers, setAnswers] = useState<IAnswer[]>([]);

  const { data: question, isLoading, prefetchNext } = useQuestionQuery(options, answers);
  const { value: correctAnswer } = question?.options.find((option) => option.isCorrect) || {};

  const submitAnswer = (answer: string) => {
    const answerObject = buildAnswerObject(question as IQuestion, answer, (answer === correctAnswer) as boolean);
    const wasLastQuestion = answers.length === options.gameLength - 1;
    setAnswers((prev) => [...prev, answerObject]);
    if (!wasLastQuestion) return prefetchNext();
  };

  const clearAnswers = () => {
    setAnswers([]);
  };

  return {
    reachedEnd: options.questionIndex >= options.gameLength,
    question,
    correctAnswer,
    isLoading,
    answers,
    submitAnswer,
    clearAnswers,
  };
};

const useQuestionQuery = ({
  questionIndex, category, difficulty, gameLength,
}: IUseTriviaQuestionProps, answers: IAnswer[]) => {
  const options: UseQueryOptions = {
    queryKey: getCacheKey({ questionIndex, category, difficulty }),
    refetchOnWindowFocus: false, // Don't refetch on window focus
    staleTime: Infinity, // Never consider the data to be stale
    cacheTime: 30 * 60 * 1000, // Cache for 30 minutes (makes it fast to jump between questions)
    enabled: answers.length < gameLength, // Don't fetch new question if we have reached the end
  };
  const query = trpc.proxy.trivia.question.get.useQuery({ category, difficulty, questionIndex }, options as any);
  const utils = trpc.proxy.useContext();
  const prefetchNext = () => utils.trivia.question.get.prefetch({
    category, difficulty, questionIndex: questionIndex + 1,
  }, options as any);
  return { ...query, prefetchNext };
};

const getCacheKey = ({ questionIndex, category = categories.generalKnowledge, difficulty = null }: any) => {
  const cacheKey = `question-c:${category}-d:${difficulty}-i:${questionIndex}`;
  return cacheKey;
};

export default useDailyTrivia;
