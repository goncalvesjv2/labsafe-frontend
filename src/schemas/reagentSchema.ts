import { z } from "zod";

export const reagentSchema = z.object({
    reagent: z.string().trim().min(1, "Informe um reagente para consultar."),
});

export type ReagentFormData = z.infer<typeof reagentSchema>;
