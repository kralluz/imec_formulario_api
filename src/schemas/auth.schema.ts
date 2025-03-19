import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .min(1, { message: "Nome é obrigatório" })
    .max(100, { message: "Máximo 100 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string(),
  role: z.enum(["ADMIN", "COMMON"]),
  createdAt: z.date(),
});

export const userOutputSchema = userSchema.omit({ password: true });
export type UserOutput = z.infer<typeof userOutputSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nome é obrigatório" })
    .max(100, { message: "Máximo 100 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string()
    .min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string()
    .min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const authResponseSchema = z.object({
  token: z.string(),
});
export type AuthResponse = z.infer<typeof authResponseSchema>;
