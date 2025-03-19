import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .min(1, { message: "Nome é obrigatório" })
    .max(100, { message: "Máximo 100 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string()
    .min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
  role: z.enum(["ADMIN", "COMMON"]),
  createdAt: z.date(),
});

export const userCreateSchema = userSchema
  .omit({ id: true, createdAt: true, role: true })
  .extend({
    role: z.enum(["ADMIN", "COMMON"]).optional(),
  });
export type UserCreateInput = z.infer<typeof userCreateSchema>;

export const userUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(["ADMIN", "COMMON"]).optional(),
});
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;

export const userOutputSchema = userSchema.omit({ password: true });
export type UserOutput = z.infer<typeof userOutputSchema>;
