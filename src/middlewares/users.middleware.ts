import { Request, Response, NextFunction } from "express";
import { userCreateSchema, userUpdateSchema } from "../schemas/users.schema";

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
