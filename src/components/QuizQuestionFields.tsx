import { Plus, Trash } from "lucide-react";
import { useFieldArray, type UseFormReturn } from "react-hook-form";
import Button from "./Button";
import FormField from "./FormField";
import Input from "./Input";
import type { QuizFormData } from "../schemas/quizSchema";

interface QuizQuestionFieldsProps {
    index: number;
    form: UseFormReturn<QuizFormData>;
    disabled: boolean;
    canAdd: boolean;
    canRemove: boolean;
    onAdd: () => void;
    onRemove: () => void;
}

function QuizQuestionFields({ index, form, disabled, canAdd, canRemove, onAdd, onRemove }: QuizQuestionFieldsProps) {
    const { register, control, setValue, formState: { errors } } = form;
    const { fields, append, remove } = useFieldArray({ control, name: `questions.${index}.alternatives` });
    const questionErrors = errors.questions?.[index];

    function removeAlternative(alternativeIndex: number) {
        remove(alternativeIndex);
        setValue(`questions.${index}.correctAlternative`, "");
    }

    return (
        <section className="flex min-w-0 flex-col gap-4" aria-labelledby={`question-heading-${index}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 id={`question-heading-${index}`} className="text-normal font-bold">Questão {index + 1}</h2>
                <div className="flex flex-wrap gap-2">
                    {canRemove && <Button variant="secondary" disabled={disabled} onClick={onRemove}><Trash size={16} /> Remover questão</Button>}
                    <Button variant="secondary" disabled={disabled || !canAdd} onClick={onAdd}><Plus size={16} /> Adicionar questão</Button>
                </div>
            </div>
            <FormField label="Enunciado:" htmlFor={`question-statement-${index}`} className="text-small">
                <textarea id={`question-statement-${index}`} {...register(`questions.${index}.statement`)} rows={4} placeholder="Digite o enunciado da questão" disabled={disabled} aria-invalid={!!questionErrors?.statement} className="w-full border border-border rounded-md p-2 bg-white text-small" />
                {questionErrors?.statement && <p role="alert" className="text-red-500">{questionErrors.statement.message}</p>}
            </FormField>
            <fieldset disabled={disabled} className="flex min-w-0 flex-col gap-3">
                <legend className="text-small font-bold mb-1">Alternativas</legend>
                <p className="text-small text-border">Marque a alternativa correta.</p>
                {fields.map((field, alternativeIndex) => (
                    <div key={field.id} className="flex items-start gap-3 border border-border rounded-md p-3">
                        <input type="radio" value={String(alternativeIndex)} {...register(`questions.${index}.correctAlternative`)} aria-label={`Marcar alternativa ${alternativeIndex + 1} da questão ${index + 1} como correta`} className="mt-8 h-4 w-4 shrink-0 accent-primary" />
                        <FormField label={`Alternativa ${alternativeIndex + 1}:`} htmlFor={`alternative-${field.id}`} className="min-w-0 flex-1 text-small">
                            <Input id={`alternative-${field.id}`} {...register(`questions.${index}.alternatives.${alternativeIndex}.text`)} placeholder="Digite o texto da alternativa" aria-invalid={!!questionErrors?.alternatives?.[alternativeIndex]?.text} />
                            {questionErrors?.alternatives?.[alternativeIndex]?.text && <p role="alert" className="text-red-500">{questionErrors.alternatives[alternativeIndex]?.text?.message}</p>}
                        </FormField>
                        {fields.length > 2 && (
                            <Button variant="secondary" className="mt-6" disabled={disabled} onClick={() => removeAlternative(alternativeIndex)} aria-label={`Remover alternativa ${alternativeIndex + 1} da questão ${index + 1}`}><Trash size={16} /></Button>
                        )}
                    </div>
                ))}
                {questionErrors?.correctAlternative && <p role="alert" className="text-small text-red-500">{questionErrors.correctAlternative.message}</p>}
                {fields.length < 4 && <div><Button variant="secondary" disabled={disabled} onClick={() => append({ text: "" })}><Plus size={16} /> Adicionar alternativa</Button></div>}
            </fieldset>
        </section>
    );
}

export default QuizQuestionFields;