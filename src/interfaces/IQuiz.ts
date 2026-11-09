export interface IQuiz {
    id: number;
    contentId: number;
    teacherId: number;
}

export interface IQuestion {
    id: number;
    quizId: number;
    statement: string;
}

export interface IAlternative {
    id: number;
    questionId: number;
    text: string;
    correct: boolean;
}

export interface IQuizQuestion extends IQuestion {
    alternatives: IAlternative[];
}
