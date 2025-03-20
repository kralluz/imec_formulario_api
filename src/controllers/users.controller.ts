import { NextFunction, Request, Response } from "express";
import { UsersService } from "../services/users.service";

export const UsersController = {
  getUsers: async (req: Request, res: Response, next: NextFunction) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Lista todos os usuários'
    // #swagger.description = 'Retorna uma lista com todos os usuários cadastrados no sistema.'
    try {
      const users = await UsersService.getUsers();
      res.json(users);
      return;
    } catch (error) {
      next(error);
    }
  },

  getUserById: async (req: Request, res: Response, next: NextFunction) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Busca um usuário por ID'
    // #swagger.description = 'Retorna os dados do usuário correspondente ao ID informado.'
    // #swagger.parameters['id'] = { description: 'ID do usuário' }
    try {
      const { id } = req.params;
      const userId = res.locals.user.id;
      const user = await UsersService.getUserById(id, userId);
      if (!user) {
        res.status(404).json({ error: "Usuário não encontrado" });
        return;
      }
      res.json(user);
      return;
    } catch (error) {
      next(error);
    }
  },

  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Atualiza um usuário'
    // #swagger.description = 'Atualiza os dados do usuário com base no ID informado e nos dados do corpo da requisição.'
    // #swagger.parameters['id'] = { description: 'ID do usuário a ser atualizado' }
    /* #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados para atualização do usuário',
          schema: {
            name: "Nome do usuário (opcional)",
            email: "Email do usuário (opcional)",
            // Outras propriedades possíveis para atualização
          }
    } */
    try {
      const { id } = req.params;
      const data = req.body;
      const userId = res.locals.user.id;
      const user = await UsersService.updateUser(id, data, userId);
      if (!user) {
        res.status(404).json({ error: "Usuário não encontrado" });
        return;
      }
      res.json(user);
      return;
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req: Request, res: Response, next: NextFunction) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Deleta um usuário'
    // #swagger.description = 'Remove o usuário correspondente ao ID informado do sistema.'
    // #swagger.parameters['id'] = { description: 'ID do usuário a ser deletado' }
    try {
      const { id } = req.params;
      const userId = res.locals.user.id;
      await UsersService.deleteUser(id, userId);
      res.json({ message: "Usuário deletado com sucesso" });
      return;
    } catch (error) {
      next(error);
    }
  },
};
