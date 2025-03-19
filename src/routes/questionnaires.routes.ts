import { Router } from "express";
import {
  adminAuthorizationMiddleware,
  authenticationMiddleware,
} from "../middlewares/auth.middleware";
import { QuestionnaireController } from "../controllers/questionnaires.controller";
import {
  dataSanitizationMiddleware,
  questionnaireCreateValidatorMiddleware,
  questionnaireUpdateValidatorMiddleware,
  uuidValidationMiddleware,
} from "../middlewares/questionnaires.middleware";

const requestLoggingMiddleware = (req: any, res: any, next: any) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
};

const questionnairesRouter = Router();

questionnairesRouter.get(
  "/",
  authenticationMiddleware,
  adminAuthorizationMiddleware,
  requestLoggingMiddleware,
  QuestionnaireController.getQuestionnaires
);

questionnairesRouter.get(
  "/:id",
  authenticationMiddleware,
  adminAuthorizationMiddleware,
  uuidValidationMiddleware,
  QuestionnaireController.getQuestionnaireById
);

questionnairesRouter.post(
  "/",
  authenticationMiddleware,
  dataSanitizationMiddleware,
  questionnaireCreateValidatorMiddleware,
  QuestionnaireController.createQuestionnaire
);

questionnairesRouter.put(
  "/:id",
  authenticationMiddleware,
  adminAuthorizationMiddleware,
  uuidValidationMiddleware,
  dataSanitizationMiddleware,
  questionnaireUpdateValidatorMiddleware,
  QuestionnaireController.updateQuestionnaire
);

questionnairesRouter.delete(
  "/:id",
  authenticationMiddleware,
  adminAuthorizationMiddleware,
  uuidValidationMiddleware,
  (req, res, next) => {
    console.log(
      `Audit Log: DELETE /questionnaires/${
        req.params.id
      } realizado por ${"desconhecido"} em ${new Date().toISOString()}`
    );
    next();
  },
  QuestionnaireController.deleteQuestionnaire
);

export default questionnairesRouter;
