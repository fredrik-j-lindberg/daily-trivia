import 'react-loading-skeleton/dist/skeleton.css';
import { useEffect, useState } from 'react';
import { NextPage } from 'next';
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
    <div className="mx-auto flex h-full w-full flex-col pt-4 text-center text-white md:pt-16 lg:w-6/12">
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
        <div className="mx-auto w-11/12">
          <h1 className="mb-4 text-xl">
            You have finished all of today&apos;s questions!
          </h1>
          { userStatsQuery.isLoading
            ? <div>Loading..</div>
            : (
              <>
                <div>Played: {userStatsQuery.data?.timesPlayed}</div>
                <div>Streak: {userStatsQuery.data?.streak}</div>
                <div>Max Streak: {userStatsQuery.data?.maxStreak}</div>
                <div>One Correct: {userStatsQuery.data?.correct_1}</div>
                <div>Two Correct: {userStatsQuery.data?.correct_2}</div>
                <div>Three Correct: {userStatsQuery.data?.correct_3}</div>
                <div>Last Played: {userStatsQuery.data?.lastPlayed.toISOString()}</div>
              </>
            )}
          <Button title="Reset" onClick={resetTrivia} />
        </div>
      )}
    </div>
  );
};

const ProgressDots = ({ answers, questionIndex }: {
  answers: IAnswer[],
  questionIndex: number
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
  correctAnswer: string | undefined,
  loading: boolean;
  submittedAnswer?: string;
}
const Question = ({
  question, submitAnswer, correctAnswer, loading, submittedAnswer,
}: QuestionProps) => (
  <div className="mx-auto w-11/12">
    <h1 className={`mb-4 text-xl ${loading && 'text-gray-400'}`}>
      {loading
        ? 'Loading question...'
        : question?.question}
    </h1>
    <div className="flex flex-col items-center justify-center gap-2 align-middle md:grid md:grid-cols-2">
      {loading
        ? new Array(4).fill(null).map((_, index) => <Button key={index} />)
        : question?.options?.map(({ value: option }, index) => {
          let color;
          let handleOnClick: typeof submitAnswer | undefined = submitAnswer;
          if (submittedAnswer) {
            const alternativeWasSubmitted = submittedAnswer === option;
            const alternativeIsCorrect = correctAnswer === option;
            color = alternativeWasSubmitted ? 'bg-incorrect' : 'bg-neutral';
            color = alternativeIsCorrect ? 'bg-correct' : color;
            handleOnClick = undefined;
          }
          return (
            <Button title={option} onClick={handleOnClick} color={color} key={index} />
          );
        })}
    </div>
  </div>
);
Question.defaultProps = {
  submittedAnswer: null,
};

export default TriviaQuestion;
