import { z } from "zod";

export const optionSchema = z.object({
  id: z.string().uuid(),
  questionId: z.string().uuid(),
  label: z.string().optional(),
  value: z.string().optional(),
  createdAt: z.date(),
});

export const questionSchema: z.ZodType<any> = z.object({
  id: z.string().uuid(),
  questionnaireId: z.string().uuid(),
  parentQuestionId: z.string().uuid().nullable(),
  triggerValue: z.string().nullable(),
  orderIndex: z.number(),
  text: z.string(),
  type: z.string(),
  createdAt: z.date(),
  options: z.array(optionSchema).default([]),
  childQuestions: z.array(z.lazy(() => questionSchema)).default([]),
});

export const questionnaireSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, { message: "Título é obrigatório" }),
  icon: z.string().optional(),
  userId: z.string().uuid(),
  createdAt: z.date(),
  questions: z.array(questionSchema).default([]),
});

export const questionnaireCreateSchema = questionnaireSchema.omit({
  id: true,
  createdAt: true,
  questions: true,
});
export type QuestionnaireCreateInput = z.infer<
  typeof questionnaireCreateSchema
>;

export const questionnaireUpdateSchema = z.object({
  title: z.string().min(1, { message: "Título é obrigatório" }).optional(),
  icon: z.string().optional(),
});
export type QuestionnaireUpdateInput = z.infer<
  typeof questionnaireUpdateSchema
>;

export const questionnaireOutputSchema = questionnaireSchema;
export type QuestionnaireOutput = z.infer<typeof questionnaireOutputSchema>;
