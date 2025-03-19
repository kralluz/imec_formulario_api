import { Router } from "express";
import {
  loginValidatorMiddleware,
  registerValidatorMiddleware,
  dataSanitizationMiddleware,
  authenticationMiddleware,
  adminAuthorizationMiddleware,
} from "../middlewares/auth.middleware";
import { AuthController } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post(
  "/login",
  dataSanitizationMiddleware,
  loginValidatorMiddleware,
  AuthController.login
);

authRouter.post(
  "/register",
  dataSanitizationMiddleware,
  registerValidatorMiddleware,
  authenticationMiddleware,
  adminAuthorizationMiddleware,
  AuthController.register
);

export default authRouter;
