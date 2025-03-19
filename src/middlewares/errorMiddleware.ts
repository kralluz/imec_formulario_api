import { Request, Response, NextFunction } from "express";
import { AppError } from "../Errors/AppError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  console.error(err);

  if (err instanceof AppError || err.statusCode) {
    res.status(err.statusCode).json({ error: err.message });
  } else if (err.name === "ZodError") {
    res.status(400).json({ error: err.errors });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
