import { AppError } from "../Errors/AppError";
import prisma from "../prisma";
import {
  QuestionnaireCreateInput,
  questionnaireOutputSchema,
  QuestionnaireUpdateInput,
} from "../schemas/questionnaires.schema";

export const QuestionnairesService = {
  getQuestionnaires: async (): Promise<
    Array<(typeof questionnaireOutputSchema)["_output"]>
  > => {
    const questionnaires = await prisma.questionnaire.findMany();
    return questionnaires.map((q) => questionnaireOutputSchema.parse(q));
  },

  getQuestionnaireById: async (
    id: string
  ): Promise<(typeof questionnaireOutputSchema)["_output"] | null> => {
    const questionnaire = await prisma.questionnaire.findUnique({
      where: { id },
    });

    if (!questionnaire) {
      throw new AppError("Questionário não encontrado", 404);
    }

    return questionnaire
      ? questionnaireOutputSchema.parse(questionnaire)
      : null;
  },

  createQuestionnaire: async (
    data: QuestionnaireCreateInput,
    userId: string
  ): Promise<(typeof questionnaireOutputSchema)["_output"]> => {
    if (userId === undefined) {
      throw new AppError("Usuário não autorizado", 401);
    }

    const userbyId = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (userbyId?.role !== "ADMIN") {
      throw new AppError("Usuário não autorizado", 401);
    }

    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    const existingQuestionnaire = await prisma.questionnaire.findFirst({
      where: { title: data.title },
    });

    if (existingQuestionnaire) {
      throw new AppError("Questionário já cadastrado", 400);
    }

    const newQuestionnaire = await prisma.questionnaire.create({
      data: {
        title: data.title,
        icon: data.icon,
        userId: data.userId,
      },
    });

    return questionnaireOutputSchema.parse(newQuestionnaire);
  },

  updateQuestionnaire: async (
    id: string,
    data: QuestionnaireUpdateInput,
    userId: string
  ): Promise<(typeof questionnaireOutputSchema)["_output"]> => {
    if (userId === undefined) {
      throw new AppError("Usuário não autorizado", 401);
    }

    const userbyId = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (userbyId?.role !== "ADMIN") {
      throw new AppError("Usuário não autorizado", 401);
    }
    const questionnaire = await prisma.questionnaire.findUnique({
      where: { id },
    });

    if (!questionnaire) {
      throw new AppError("Questionário não encontrado", 404);
    }

    const updatedQuestionnaire = await prisma.questionnaire.update({
      where: { id },
      data,
    });

    return questionnaireOutputSchema.parse(updatedQuestionnaire);
  },

  deleteQuestionnaire: async (id: string, userId: string): Promise<void> => {
    if (userId === undefined) {
      throw new AppError("Usuário não autorizado", 401);
    }

    const userbyId = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (userbyId?.role !== "ADMIN") {
      throw new AppError("Usuário não autorizado", 401);
    }

    const questionnaire = await prisma.questionnaire.findUnique({
      where: { id },
    });

    if (!questionnaire) {
      throw new AppError("Questionário não encontrado", 404);
    }

    await prisma.questionnaire.delete({ where: { id } });
  },
};
