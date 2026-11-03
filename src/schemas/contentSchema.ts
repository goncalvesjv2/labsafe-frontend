import { z } from "zod";

export const contentSchema = z.object({
    title: z.string().trim().min(1, "Informe o título.").max(150, "O título deve ter no máximo 150 caracteres."),
    description: z.string().trim().min(1, "Informe a descrição."),
});

export type ContentFormData = z.infer<typeof contentSchema>;
