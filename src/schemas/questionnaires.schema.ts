import { z } from "zod";

export const questionnaireSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, { message: "Título é obrigatório" }),
  icon: z.string().optional(),
  userId: z.string().uuid(),
  createdAt: z.date(),
});

export const questionnaireCreateSchema = questionnaireSchema.omit({
  id: true,
  createdAt: true,
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
