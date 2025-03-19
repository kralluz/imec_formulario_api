import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { Prisma } from "@prisma/client";

export const loginValidatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    req.body = loginSchema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({ error: error.errors });
    return;
  }
};

export const registerValidatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    req.body = registerSchema.parse(req.body);
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

export interface RequestWithUser extends Request {
  user?: any;
}

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const authenticationMiddleware = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "Token não informado" });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido" });
    return;
  }
};

export const adminAuthorizationMiddleware = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): void => {
  res.locals.user = req.user
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    res.status(403).json({ message: "Acesso negado" });
  }
};

export const rateLimitMiddleware = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Muitas requisições, tente novamente mais tarde.",
});
