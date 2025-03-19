import { Request, Response, NextFunction } from "express";
import { submissionSchema } from "../schemas/submission.schema";

export const submissionValidatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body = submissionSchema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({ error: error.errors });
    return;
  }
};

export const dataSanitizationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body && typeof req.body === "object") {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = req.body[key].trim();
      }
    }
  }
  next();
};

import { z } from "zod";
export const uuidValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const paramsSchema = z.object({
    id: z.string().uuid({ message: "ID inválido" }),
  });
  try {
    paramsSchema.parse(req.params);
    next();
  } catch (error: any) {
    res.status(400).json({ error: error.errors });
    return;
  }
};
