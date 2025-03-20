import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  questionnaireCreateSchema,
  questionnaireUpdateSchema,
} from "../schemas/questionnaires.schema";

export const questionnaireCreateValidatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body = questionnaireCreateSchema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({ error: error.errors });
    return;
  }
};

export const questionnaireUpdateValidatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body = questionnaireUpdateSchema.parse(req.body);
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
