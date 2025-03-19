import { Router } from "express";

import { UsersController } from "../controllers/users.controller";
import {
  auditLoggingMiddleware,
  dataSanitizationMiddleware,
  userCreateValidatorMiddleware,
  userUpdateValidatorMiddleware,
  uuidValidationMiddleware,
} from "../middlewares/users.middleware";
import {
  adminAuthorizationMiddleware,
  authenticationMiddleware,
} from "../middlewares/auth.middleware";

const requestLoggingMiddleware = (req: any, res: any, next: any) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
};

const userRoute = Router();

userRoute.get(
  "/",
  authenticationMiddleware,
  requestLoggingMiddleware,
  UsersController.getUsers
);

userRoute.get(
  "/:id",
  authenticationMiddleware,
  adminAuthorizationMiddleware,
  uuidValidationMiddleware,
  UsersController.getUserById
);

userRoute.put(
  "/:id",
  authenticationMiddleware,
  adminAuthorizationMiddleware,
  uuidValidationMiddleware,
  dataSanitizationMiddleware,
  userUpdateValidatorMiddleware,
  UsersController.updateUser
);

userRoute.delete(
  "/:id",
  authenticationMiddleware,
  adminAuthorizationMiddleware,
  uuidValidationMiddleware,
  auditLoggingMiddleware,
  UsersController.deleteUser
);

export default userRoute;
