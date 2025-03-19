import { Router } from "express";
import { SubmissionsController } from "../controllers/submissions.controller";

import {
  dataSanitizationMiddleware,
  submissionValidatorMiddleware,
  uuidValidationMiddleware,
} from "../middlewares/submissions.middleware";
import {
  adminAuthorizationMiddleware,
  authenticationMiddleware,
} from "../middlewares/auth.middleware";

const SubmissionsRouter = Router();

SubmissionsRouter.post(
  "/",
  authenticationMiddleware,
  submissionValidatorMiddleware,
  dataSanitizationMiddleware,
  SubmissionsController.submitForm
);

SubmissionsRouter.get(
  "/pdfs",
  authenticationMiddleware,
  adminAuthorizationMiddleware,
  uuidValidationMiddleware,
  SubmissionsController.getPdfById
);

SubmissionsRouter.get(
  "/questionnaires/pdfs",
  authenticationMiddleware,
  adminAuthorizationMiddleware,
  SubmissionsController.getPdfsByQuestionnaire
);

SubmissionsRouter.get(
  "/pdfs/verify/:id",
  uuidValidationMiddleware,
  SubmissionsController.verifyPdf
);

export default SubmissionsRouter;
