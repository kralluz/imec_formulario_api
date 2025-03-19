// src/schemas/submission.schema.ts

import { z } from "zod";

export const submissionSchema = z.object({
  deviceInfo: z
    .object({
      deviceId: z.string().optional(),
      ip: z.string().min(1, { message: "IP é obrigatório" }),
      userAgent: z.string().optional(),
    })
    .optional(),
  networkInfo: z
    .object({
      ip: z.string().optional(),
    })
    .optional(),
  origin: z.string().url().optional(),
  formData: z.object({
    questionnaireId: z.string().uuid({ message: "QuestionnaireId inválido" }),
    responses: z.array(
      z.object({
        question: z.string().min(1, { message: "Pergunta é obrigatória" }),
        answer: z.any().optional()
      })
    ),
    signature: z.string().min(1, { message: "Assinatura é obrigatória" }),
  }),
  additionalData: z
    .object({
      patientName: z.string().optional(),
      cpf: z.string().optional(),
      birthDate: z.string().optional(),
      age: z.string().optional(),
      logoUrl: z.string().url().optional()
    })
    .optional(),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;
