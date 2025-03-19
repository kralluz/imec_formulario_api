import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  questionWithOptionsCreateSchema,
  questionUpdateSchema,
  optionUpdateSchema,
} from "../schemas/questions.schema";

// Validação do parâmetro de rota :id para questões
export const questionIdValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const schema = z.object({ id: z.string().uuid({ message: "ID de questão inválido" }) });
  try {
    schema.parse(req.params);
    next();
  } catch (error: any) {
    res.status(400).json({ error: error.errors });
  }
};

// Validação do parâmetro de rota :id para opções
export const optionIdValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const schema = z.object({ id: z.string().uuid({ message: "ID de opção inválido" }) });
  try {
    schema.parse(req.params);
    next();
  } catch (error: any) {
    res.status(400).json({ error: error.errors });
  }
};

// Valida o payload para criação de questão com opções
export const questionWithOptionsValidatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = questionWithOptionsCreateSchema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({ error: error.errors });
  }
};

// Valida o payload para atualização de questão
export const questionUpdateValidatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = questionUpdateSchema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({ error: error.errors });
  }
};

// Valida o payload para atualização de opção
export const optionUpdateValidatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = optionUpdateSchema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({ error: error.errors });
  }
};

// Middleware para sanitizar os dados do corpo da requisição
export const dataSanitizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.body && typeof req.body === "object") {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = req.body[key].trim();
      }
    }
  }
  next();
};
