import { z } from "zod";

// Schema de uma opção
export const optionSchema = z.object({
  id: z.string().uuid().optional(), // opcional na criação (gerado pelo banco)
  questionId: z.string().uuid().optional(), // atribuído depois
  label: z.string().min(1, { message: "Label é obrigatório" }),
  value: z.string().min(1, { message: "Value é obrigatório" }),
  createdAt: z.date().optional(),
});
export type Option = z.infer<typeof optionSchema>;

// Schema de uma questão
export const questionSchema = z.object({
  id: z.string().uuid(),
  questionnaireId: z.string().uuid(),
  parentQuestionId: z.string().uuid().optional(),
  triggerValue: z.string().optional(),
  orderIndex: z.number(),
  text: z.string().min(1, { message: "Texto da pergunta é obrigatório" }),
  type: z.enum(["text", "textarea", "radio", "checkbox", "date", "number"]),
  createdAt: z.date(),
});
export type Question = z.infer<typeof questionSchema>;

// Schema para criação de questão (sem id e createdAt)
export const questionCreateSchema = questionSchema.omit({ id: true, createdAt: true });
export type QuestionCreateInput = z.infer<typeof questionCreateSchema>;

// Schema para criação de opção (sem id, questionId e createdAt)
export const optionCreateSchema = optionSchema.omit({ id: true, questionId: true, createdAt: true });
export type OptionCreateInput = z.infer<typeof optionCreateSchema>;

// Schema combinado para criação de questão com opções
export const questionWithOptionsCreateSchema = z.object({
  questionnaireId: z.string().uuid({ message: "QuestionnaireId inválido" }),
  parentQuestionId: z.string().uuid().optional(),
  triggerValue: z.string().optional(),
  orderIndex: z.number(),
  text: z.string().min(1, { message: "Texto da pergunta é obrigatório" }),
  type: z.enum(["text", "textarea", "radio", "checkbox", "date", "number"]),
  options: z.array(optionCreateSchema).optional(), // pode ser vazio se a questão não tiver opções
});
export type QuestionWithOptionsCreateInput = z.infer<typeof questionWithOptionsCreateSchema>;

// Schema para atualização de questão (campos opcionais)
export const questionUpdateSchema = z.object({
  text: z.string().min(1, { message: "Texto da pergunta é obrigatório" }).optional(),
  orderIndex: z.number().optional(),
  triggerValue: z.string().optional(),
});
export type QuestionUpdateInput = z.infer<typeof questionUpdateSchema>;

// Schema para atualização de opção
export const optionUpdateSchema = z.object({
  label: z.string().min(1, { message: "Label é obrigatório" }).optional(),
  value: z.string().min(1, { message: "Value é obrigatório" }).optional(),
});
export type OptionUpdateInput = z.infer<typeof optionUpdateSchema>;
