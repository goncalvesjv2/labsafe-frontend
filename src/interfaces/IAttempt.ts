export interface IAttempt {
    id: number;
    quizId: number;
    studentId: number;
    score: number;
    approved: boolean;
    createdAt: string;
}

export interface IQuizResult {
    attempt: IAttempt;
    totalQuestions: number;
    correctCount: number;
}

export interface IAttemptWithStudent extends IAttempt {
    studentName: string;
}
