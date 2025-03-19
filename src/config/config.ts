import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z
    .string()
    .regex(/^\d+$/, { message: "PORT deve ser um número válido." })
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Variáveis de ambiente inválidas:", parsedEnv.error.format());
  process.exit(1);
}

const { PORT: envPort } = parsedEnv.data;

const DEFAULT_PORT_WIN32 = 3000;
const DEFAULT_PORT_OTHER = 8080;

const PORT: number =
  process.platform === "win32"
    ? DEFAULT_PORT_WIN32
    : envPort || DEFAULT_PORT_OTHER;

export { PORT };
