import { z } from "zod";

const questionSchema = z.object({
    statement: z.string().trim().min(1, "Informe o enunciado."),
    alternatives: z.array(z.object({
        text: z.string().trim().min(1, "Informe o texto da alternativa."),
    })).min(2, "Cadastre pelo menos 2 alternativas.").max(4, "Cadastre no máximo 4 alternativas."),
    correctAlternative: z.string().regex(/^[0-3]$/, "Selecione a alternativa correta."),
}).refine((question) => Number(question.correctAlternative) < question.alternatives.length, {
    path: ["correctAlternative"],
    message: "Selecione a alternativa correta.",
});

export const quizSchema = z.object({
    contentId: z.string().regex(/^[1-9]\d*$/, "Selecione um conteúdo."),
    questions: z.array(questionSchema).min(1, "Cadastre pelo menos uma questão.").max(10, "O quiz pode ter no máximo 10 questões."),
});

export type QuizFormData = z.infer<typeof quizSchema>;
export type QuizQuestionFormData = z.infer<typeof questionSchema>;
