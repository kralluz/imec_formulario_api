import prisma from "../prisma";
import { AppError } from "../Errors/AppError";
import {
  QuestionWithOptionsCreateInput,
  QuestionUpdateInput,
  OptionUpdateInput,
} from "../schemas/questions.schema";

export const QuestionsService = {
  getQuestionsByQuestionnaire: async (questionnaireId: string) => {
    const questions = await prisma.question.findMany({
      where: { questionnaireId },
      include: { options: true },
    });
    return questions;
  },

  getQuestionById: async (id: string) => {
    const question = await prisma.question.findUnique({
      where: { id },
      include: { options: true },
    });
    if (!question) {
      throw new AppError("Questão não encontrada", 404);
    }
    return question;
  },

  createQuestion: async (
    data: QuestionWithOptionsCreateInput,
    userId: string
  ) => {
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
      where: { id: data.questionnaireId },
    });
    if (!questionnaire) {
      throw new AppError("Questionário não encontrado", 404);
    }

    if (data.parentQuestionId) {
      const parentQuestion = await prisma.question.findUnique({
        where: { id: data.parentQuestionId },
      });
      if (!parentQuestion) {
        throw new AppError("Questão pai não encontrada", 404);
      }
    }

    const newQuestion = await prisma.question.create({
      data: {
        questionnaireId: data.questionnaireId,
        parentQuestionId: data.parentQuestionId,
        triggerValue: data.triggerValue,
        orderIndex: data.orderIndex,
        text: data.text,
        type: data.type,
        options: {
          create: data.options || [],
        },
      },
      include: {
        options: true,
      },
    });
    return newQuestion;
  },

  updateQuestion: async (
    id: string,
    data: QuestionUpdateInput,
    userId: string
  ) => {
    if (userId === undefined) {
      throw new AppError("Usuário não autorizado", 401);
    }

    const userbyId = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (userbyId?.role !== "ADMIN") {
      throw new AppError("Usuário não autorizado", 401);
    }
    const question = await prisma.question.findUnique({ where: { id } });
    if (!question) {
      throw new AppError("Questão não encontrada", 404);
    }
    const updatedQuestion = await prisma.question.update({
      where: { id },
      data,
      include: { options: true },
    });
    return updatedQuestion;
  },

  deleteQuestion: async (id: string, userId: string) => {
    if (userId === undefined) {
      throw new AppError("Usuário não autorizado", 401);
    }

    const userbyId = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (userbyId?.role !== "ADMIN") {
      throw new AppError("Usuário não autorizado", 401);
    }

    const question = await prisma.question.findUnique({ where: { id } });
    if (!question) {
      throw new AppError("Questão não encontrada", 404);
    }

    await prisma.option.deleteMany({
      where: { questionId: id },
    });

    await prisma.question.deleteMany({
      where: { parentQuestionId: id },
    });

    await prisma.question.delete({
      where: { id },
    });
  },

  updateOption: async (id: string, data: OptionUpdateInput, userId: string) => {
    if (userId === undefined) {
      throw new AppError("Usuário não autorizado", 401);
    }

    const userbyId = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (userbyId?.role !== "ADMIN") {
      throw new AppError("Usuário não autorizado", 401);
    }

    const option = await prisma.option.findUnique({ where: { id } });
    if (!option) {
      throw new AppError("Opção não encontrada", 404);
    }
    const updatedOption = await prisma.option.update({
      where: { id },
      data,
    });
    return updatedOption;
  },

  deleteOption: async (id: string, userId: string) => {
    if (userId === undefined) {
      throw new AppError("Usuário não autorizado", 401);
    }

    const userbyId = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (userbyId?.role !== "ADMIN") {
      throw new AppError("Usuário não autorizado", 401);
    }
    
    const option = await prisma.option.findUnique({ where: { id } });
    if (!option) {
      throw new AppError("Opção não encontrada", 404);
    }
    await prisma.option.delete({ where: { id } });
  },
};
