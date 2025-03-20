import { Request, Response, NextFunction } from "express";
import { QuestionsService } from "../services/questions.service";

export const QuestionsController = {
  getQuestionsByQuestionnaire: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // #swagger.tags = ['Questions']
    // #swagger.summary = 'Lista questões por questionário'
    // #swagger.description = 'Retorna uma lista de questões associadas ao questionário informado.'
    /* #swagger.parameters['body'] = {
          in: 'body',
          description: 'ID do questionário para buscar as questões',
          schema: { questionnaireId: "UUID do questionário" }
    } */
    try {
      const { questionnaireId } = req.body;
      const questions = await QuestionsService.getQuestionsByQuestionnaire(
        questionnaireId
      );
      res.json(questions);
    } catch (error) {
      next(error);
    }
  },

  createQuestion: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // #swagger.tags = ['Questions']
    // #swagger.summary = 'Cria uma nova questão'
    // #swagger.description = 'Cria uma nova questão com base nos dados fornecidos no corpo da requisição.'
    /* #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados para criação da questão',
          schema: {
            questionnaireId: "UUID do questionário",
            parentQuestionId: "UUID da questão pai (opcional)",
            triggerValue: "Valor disparador (opcional)",
            orderIndex: 1,
            text: "Texto da questão",
            type: "Tipo da questão",
            options: "Array de opções (opcional)"
          }
    } */
    try {
      const data = req.body;
      const userId = res.locals.user.id;
      const newQuestion = await QuestionsService.createQuestion(data, userId);
      res.status(201).json(newQuestion);
    } catch (error) {
      next(error);
    }
  },

  updateQuestion: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // #swagger.tags = ['Questions']
    // #swagger.summary = 'Atualiza uma questão'
    // #swagger.description = 'Atualiza os dados de uma questão com base no ID informado e nos dados do corpo da requisição.'
    // #swagger.parameters['id'] = { description: 'ID da questão a ser atualizada' }
    /* #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados para atualização da questão',
          schema: {
            questionnaireId: "UUID do questionário (opcional)",
            parentQuestionId: "UUID da questão pai (opcional)",
            triggerValue: "Valor disparador (opcional)",
            orderIndex: 1,
            text: "Texto da questão (opcional)",
            type: "Tipo da questão (opcional)",
            options: "Array de opções (opcional)"
          }
    } */
    try {
      const { id } = req.params;
      const data = req.body;
      const userId = res.locals.user.id;
      const updatedQuestion = await QuestionsService.updateQuestion(
        id,
        data,
        userId
      );
      res.json(updatedQuestion);
    } catch (error) {
      next(error);
    }
  },

  deleteQuestion: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // #swagger.tags = ['Questions']
    // #swagger.summary = 'Deleta uma questão'
    // #swagger.description = 'Remove uma questão do sistema com base no ID informado.'
    // #swagger.parameters['id'] = { description: 'ID da questão a ser deletada' }
    try {
      const { id } = req.params;
      const userId = res.locals.user.id;
      await QuestionsService.deleteQuestion(id, userId);
      res.json({ message: "Questão deletada com sucesso" });
    } catch (error) {
      next(error);
    }
  },

  updateOption: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // #swagger.tags = ['Questions']
    // #swagger.summary = 'Atualiza uma opção de questão'
    // #swagger.description = 'Atualiza os dados de uma opção associada a uma questão com base no ID informado.'
    // #swagger.parameters['id'] = { description: 'ID da opção a ser atualizada' }
    /* #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados para atualização da opção',
          schema: {
            label: "Rótulo da opção (opcional)",
            value: "Valor da opção (opcional)"
          }
    } */
    try {
      const { id } = req.params;
      const data = req.body;
      const userId = res.locals.user.id;
      const updatedOption = await QuestionsService.updateOption(id, data, userId);
      res.json(updatedOption);
    } catch (error) {
      next(error);
    }
  },

  deleteOption: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // #swagger.tags = ['Questions']
    // #swagger.summary = 'Deleta uma opção de questão'
    // #swagger.description = 'Remove uma opção associada a uma questão com base no ID informado.'
    // #swagger.parameters['id'] = { description: 'ID da opção a ser deletada' }
    try {
      const { id } = req.params;
      const userId = res.locals.user.id;
      await QuestionsService.deleteOption(id, userId);
      res.json({ message: "Opção deletada com sucesso" });
    } catch (error) {
      next(error);
    }
  },
};
