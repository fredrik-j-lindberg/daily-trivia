import 'react-loading-skeleton/dist/skeleton.css';
import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { UseQueryResult } from 'react-query';
import { TriviaStats } from '@prisma/client';
import { DefaultErrorShape } from '@trpc/server';
import Skeleton from 'react-loading-skeleton';
import useDailyTrivia, { IAnswer, IQuestion } from '../hooks/useDailyTrivia';
import { Button } from '../components/Buttons';

const MS_BEFORE_NEXT_QUESTION = 1500;

// TODO: Add some kind of scoring system (how many 1, 2, 3 correct answers you have gotten?)
// TODO: Add celebration animation when answering all 3 correctly
// TODO: Add a way to go back to a previous question
// TODO: Store user answered questions somewhere (only repeat questions not yet answered correctly?)
// TODO: Simple logo somewhere?
// TODO: Host somewhere

const TriviaQuestion: NextPage = () => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const {
    reachedEnd,
    question,
    correctAnswer,
    isLoading,
    answers,
    submitAnswer,
    clearAnswers,
    userStatsQuery,
  } = useDailyTrivia({ questionIndex, gameLength: 3 });

  useEffect(() => {
    if (!answers.length) return;
    const interval = setTimeout(() => {
      setQuestionIndex((prev) => prev + 1);
    }, MS_BEFORE_NEXT_QUESTION);
    return () => clearInterval(interval);
  }, [answers]);

  console.log('### fredrik 1: question', {
    questionIndex, question, isLoading, reachedEnd,
  });

  const resetTrivia = () => {
    clearAnswers();
    setQuestionIndex(0);
  };

  return (
    <div className="mx-auto flex h-full w-full flex-col pt-4 text-center text-white md:w-8/12 md:pt-16 lg:w-5/12">
      <ProgressDots answers={answers} questionIndex={questionIndex} />
      {!reachedEnd ? (
        <Question
          question={question}
          submitAnswer={submitAnswer}
          correctAnswer={correctAnswer}
          loading={isLoading}
          submittedAnswer={answers[questionIndex]?.answer}
        />
      ) : (
        <EndScreen userStatsQuery={userStatsQuery} resetTrivia={resetTrivia} />
      )}
    </div>
  );
};

const ProgressDots = ({ answers, questionIndex }: {
  answers: IAnswer[];
  questionIndex: number;
}) => {
  const getColorClass = (answerInfo?: IAnswer) => {
    if (!answerInfo || !answerInfo.answer) return 'bg-neutral'; // Unanswered question
    if (answerInfo.isCorrect) return 'bg-correct';
    return 'bg-incorrect';
  };

  return (
    <div className="mb-2 flex justify-center gap-1">
      {[...Array(3)].map((_, i) => {
        const isCurrent = i === questionIndex;
        return (
          <div
            key={answers[i]?.question.question || i}
            className={`
        ${getColorClass(answers[i])} 
        ${isCurrent && 'border-2 border-white'}
        mb-2 h-8 w-8 rounded-full`}
          />
        );
      })}
    </div>
  );
};

interface QuestionProps {
  question: IQuestion | undefined;
  submitAnswer: (answer: string) => void;
  correctAnswer: string | undefined;
  loading: boolean;
  submittedAnswer?: string;
}
const Question = ({
  question, submitAnswer, correctAnswer, loading, submittedAnswer,
}: QuestionProps) => (
  <div className="mx-auto w-full">
    <h1 className={`mb-4 text-xl ${loading && 'text-gray-400'}`}>
      {loading
        ? 'Loading question...'
        : question?.question}
    </h1>
    <div className="flex flex-col items-center justify-center gap-2 align-middle md:grid md:grid-cols-2">
      {loading
        ? new Array(4).fill(null).map((_, index) => <Button loading key={index} />)
        : question?.options?.map(({ value: option }, index) => {
          let color;
          let handleOnClick: any = () => submitAnswer(option);
          if (submittedAnswer) {
            const alternativeWasSubmitted = submittedAnswer === option;
            const alternativeIsCorrect = correctAnswer === option;
            color = alternativeWasSubmitted ? 'bg-incorrect' : 'bg-neutral';
            color = alternativeIsCorrect ? 'bg-correct' : color;
            handleOnClick = undefined;
          }
          return (
            <Button onClick={handleOnClick} color={color} key={index}>
              <p className="text-lg font-semibold text-gray-700">{option}</p>
            </Button>
          );
        })}
    </div>
  </div>
);
Question.defaultProps = {
  submittedAnswer: null,
};

const EndScreen = ({ userStatsQuery, resetTrivia }: {
  userStatsQuery: UseQueryResult<TriviaStats | null, DefaultErrorShape>;
  resetTrivia: () => void;
}) => {
  const { data: stats, isLoading: statsLoading } = userStatsQuery;
  const {
    timesPlayed = 0,
    streak = 0,
    maxStreak = 0,
    correct_1: correct1 = 0,
    correct_2: correct2 = 0,
    correct_3: correct3 = 0,
    lastPlayed,
  } = stats || {};
  const highestValue = Math.max(correct1, correct2, correct3);
  return (
    <div className="mx-auto w-full">
      <h1 className="mb-4 text-xl">
        You have finished all of today&apos;s questions!
      </h1>
      <div className="flex flex-col gap-2 rounded-md bg-foreground py-2">
        <h1 className="text-xl">{
            !statsLoading && !stats
              ? 'Not signed in - Stats not tracked'
              : 'Statistics'
            }
        </h1>
        <div className="flex justify-center gap-3">
          <KPI value={timesPlayed} label="Played" isLoading={statsLoading} />
          <KPI value={streak} label="Streak" isLoading={statsLoading} />
          <KPI value={maxStreak} label="Max Streak" isLoading={statsLoading} />
        </div>
        <hr className="my-2 border-background" />
        <h1 className="text-base"># of Correct Answers Distribution</h1>
        <div className="mx-4 my-1 flex flex-col gap-1">
          <Bar legend="1" value={correct1} highestValue={highestValue} isLoading={statsLoading} />
          <Bar legend="2" value={correct2} highestValue={highestValue} isLoading={statsLoading} />
          <Bar legend="3" value={correct3} highestValue={highestValue} isLoading={statsLoading} />
        </div>
        <hr className="my-2 border-background" />
        <div className="flex justify-center">
          <span className="whitespace-nowrap px-1">Last Played:</span>
          <span className={`${statsLoading && 'w-1/2'}`}>{
              statsLoading
                ? <Skeleton baseColor="gray" />
                : (lastPlayed?.toLocaleString() || 'Not Applicable')
            }
          </span>
        </div>
      </div>
      <div className="mt-4">
        <Button onClick={resetTrivia}>
          <p className="text-lg font-semibold text-gray-700">Restart Questions</p>
        </Button>
      </div>
    </div>
  );
};

const KPI = ({ value, label, isLoading }: {
  value: number;
  label: string;
  isLoading: boolean;
}) => (
  <div className="basis-0">
    <div className="text-3xl text-accent md:text-4xl">{
    isLoading
      ? <Skeleton baseColor="gray" />
      : value
      }
    </div>
    <div className="text-xs">{label}</div>
  </div>
);

const Bar = ({
  legend, value, highestValue, isLoading,
}: {
  legend: string;
  value: number;
  highestValue: number;
  isLoading: boolean;
}) => (
  <div className="flex">
    <div className="mr-2 tabular-nums">{legend}</div>
    <div className="w-full">
      {
    isLoading
      ? <Skeleton baseColor="gray" />
      : (
        <div
          style={{ width: `${Math.max((value / highestValue) * 100, 7)}%` }}
          className="rounded-r bg-accent px-2 text-right font-semibold text-black"
        >
          {value}
        </div>
      )
      }
    </div>
  </div>
);

export default TriviaQuestion;
