import { NextFunction, Request, Response } from "express";

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