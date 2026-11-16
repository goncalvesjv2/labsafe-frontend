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
    totalQuestions: number | null;
    correctCount: number | null;
}

export interface IStudentQuizResult {
    canAnswer: boolean;
    result: IQuizResult | null;
}

export interface IAttemptWithStudent extends IAttempt {
    studentName: string;
}
