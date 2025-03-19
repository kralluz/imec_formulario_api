import { Router } from "express";
import { QuestionsController } from "../controllers/questions.controller";
import {
  authenticationMiddleware,
  adminAuthorizationMiddleware,
} from "../middlewares/auth.middleware";
import {
  questionIdValidationMiddleware,
  optionIdValidationMiddleware,
  questionWithOptionsValidatorMiddleware,
  questionUpdateValidatorMiddleware,
  optionUpdateValidatorMiddleware,
  dataSanitizationMiddleware,
} from "../middlewares/questions.middleware";

const requestLoggingMiddleware = (req: any, res: any, next: any) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
};

const router = Router();

router.post(
  "/by-questionnaire",
  authenticationMiddleware,
  requestLoggingMiddleware,
  QuestionsController.getQuestionsByQuestionnaire
);

router.post(
  "/",
  authenticationMiddleware,
  adminAuthorizationMiddleware,
  dataSanitizationMiddleware,
  questionWithOptionsValidatorMiddleware,
  QuestionsController.createQuestion
);

router.put(
  "/:id",
  authenticationMiddleware,
  adminAuthorizationMiddleware,
  questionIdValidationMiddleware,
  dataSanitizationMiddleware,
  questionUpdateValidatorMiddleware,
  QuestionsController.updateQuestion
);

router.delete(
  "/:id",
  authenticationMiddleware,
  adminAuthorizationMiddleware,
  questionIdValidationMiddleware,
  (req, res, next) => {
    console.log(
      `Audit Log: DELETE /questions/${
        req.params.id
      } realizado por ${"desconhecido"} em ${new Date().toISOString()}`
    );
    next();
  },
  QuestionsController.deleteQuestion
);

router.put(
  "/options/:id",
  authenticationMiddleware,
  adminAuthorizationMiddleware,
  optionIdValidationMiddleware,
  dataSanitizationMiddleware,
  optionUpdateValidatorMiddleware,
  QuestionsController.updateOption
);

router.delete(
  "/options/:id",
  authenticationMiddleware,
  adminAuthorizationMiddleware,
  optionIdValidationMiddleware,
  (req, res, next) => {
    console.log(
      `Audit Log: DELETE /options/${
        req.params.id
      } realizado por ${"desconhecido"} em ${new Date().toISOString()}`
    );
    next();
  },
  QuestionsController.deleteOption
);

export default router;
