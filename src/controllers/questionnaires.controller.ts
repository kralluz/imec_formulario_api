import { NextFunction, Request, Response } from "express";
import { QuestionnairesService } from "../services/questionnaires.service";

export const QuestionnaireController = {
  getQuestionnaires: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // #swagger.tags = ['Questionnaires']
    // #swagger.summary = 'Lista todos os questionários'
    // #swagger.description = 'Retorna uma lista com todos os questionários cadastrados no sistema.'
    try {
      const questionnaires = await QuestionnairesService.getQuestionnaires();
      res.json(questionnaires);
    } catch (error) {
      next(error);
    }
  },

  getQuestionnaireById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // #swagger.tags = ['Questionnaires']
    // #swagger.summary = 'Busca um questionário por ID'
    // #swagger.description = 'Retorna os dados do questionário correspondente ao ID informado.'
    // #swagger.parameters['id'] = { description: 'ID do questionário' }
    try {
      const { id } = req.params;
      const questionnaire = await QuestionnairesService.getQuestionnaireById(
        id
      );
      res.json(questionnaire);
    } catch (error) {
      next(error);
    }
  },

  createQuestionnaire: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // #swagger.tags = ['Questionnaires']
    // #swagger.summary = 'Cria um novo questionário'
    // #swagger.description = 'Cria um novo questionário com base nos dados fornecidos no corpo da requisição.'
    /* #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados para criação do questionário',
          schema: {
            title: "Título do Questionário",
            icon: "Opcional - URL do ícone",
            userId: "UUID do usuário"
          }
    } */
    try {
      const userId = res.locals.user.id;
      const newQuestionnaire = await QuestionnairesService.createQuestionnaire(
        req.body,
        userId
      );
      res.status(201).json(newQuestionnaire);
    } catch (error) {
      next(error);
    }
  },

  updateQuestionnaire: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // #swagger.tags = ['Questionnaires']
    // #swagger.summary = 'Atualiza um questionário existente'
    // #swagger.description = 'Atualiza os dados de um questionário com base no ID informado e nos dados do corpo da requisição.'
    // #swagger.parameters['id'] = { description: 'ID do questionário a ser atualizado' }
    /* #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados para atualização do questionário',
          schema: {
            title: "Novo título (opcional)",
            icon: "Novo ícone (opcional)"
          }
    } */
    try {
      const { id } = req.params;
      const userId = res.locals.user.id;
      const updatedQuestionnaire =
        await QuestionnairesService.updateQuestionnaire(id, req.body, userId);
      res.json(updatedQuestionnaire);
    } catch (error) {
      next(error);
    }
  },

  deleteQuestionnaire: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // #swagger.tags = ['Questionnaires']
    // #swagger.summary = 'Deleta um questionário'
    // #swagger.description = 'Remove o questionário correspondente ao ID informado do sistema.'
    // #swagger.parameters['id'] = { description: 'ID do questionário a ser removido' }
    try {
      const { id } = req.params;
      const userId = res.locals.user.id;
      await QuestionnairesService.deleteQuestionnaire(id, userId);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  },
};
