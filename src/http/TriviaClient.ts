import { Question, QuestionOption } from '@prisma/client';
import HttpClient from './HttpClient';

export const difficulties = {
  easy: 'easy',
  medium: 'medium',
  hard: 'hard',
};

export const categories = {
  generalKnowledge: '9',
};

type IExternalQuestionOptions = Omit<QuestionOption, 'id' | 'questionId'>;
type IExternalQuestion = Omit<Question, 'id' | 'insertedAt'> & {
  options: IExternalQuestionOptions[];
};

export default class TriviaClient {
  client: HttpClient;

  constructor() {
    this.client = new HttpClient({ baseUrl: 'https://opentdb.com/api.php' });
  }

  async getQuestion(difficulty?: string, category = categories.generalKnowledge): Promise<IExternalQuestion> {
    const params = {
      amount: '1',
      category,
      encode: 'url3986',
      ...(difficulty && { difficulty }),
    };
    const { results } = await this.client.get('/', { params });

    const question = results[0];
    const parsedQuestion = {
      question: decodeURIComponent(question.question),
      correctAnswer: decodeURIComponent(question.correct_answer),
      incorrectAnswers: question.incorrect_answers.map(decodeURIComponent) as string[],
      difficulty: decodeURIComponent(question.difficulty),
      type: decodeURIComponent(question.type),
    };

    const { correctAnswer, incorrectAnswers, ...baseQuestion } = parsedQuestion;

    return {
      ...baseQuestion,
      category,
      options: [
        { value: correctAnswer, isCorrect: true },
        ...incorrectAnswers.map((value) => ({ value, isCorrect: false })),
      ]
        // Randomize order of alternatives
        .map((alternative) => ({ alternative, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ alternative }) => alternative),
    };
  }
}
