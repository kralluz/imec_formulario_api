import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { userCreateSchema, userUpdateSchema } from "../schemas/users.schema";

const validateUUID = (uuid: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const uuidValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { id } = req.params;
  if (!validateUUID(id)) {
    res.status(400).json({ error: "Invalid UUID" });
  } else {
    next();
  }
};

export const userCreateValidatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body = userCreateSchema.parse(req.body);
    next();
  } catch (error: any) {
    next(error);
    return;
  }
};

export const userUpdateValidatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body = userUpdateSchema.parse(req.body);
    next();
  } catch (error: any) {
    next(error);
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

interface RequestWithUser extends Request {
  user?: { id: string; [key: string]: any };
}

export const auditLoggingMiddleware = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  console.log(
    `Audit Log - ${req.method} ${req.originalUrl} realizado por ${
      req.user?.id || "desconhecido"
    } em ${new Date().toISOString()}`
  );
  next();
};
