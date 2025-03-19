import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { LoginInput, RegisterInput } from "../schemas/auth.schema";

export const AuthController = {
  login: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // #swagger.tags = ['Auth']
    // #swagger.summary = 'Realiza o login do usuário'
    // #swagger.description = 'Autentica o usuário com base nas credenciais fornecidas no corpo da requisição.'
    /* #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados para login',
          schema: {
              email: 'carlos@gmail.com',
              password: 'wadawcxa#¨_05#'
          }
    } */
    try {
      const { email, password } = req.body as LoginInput;
      const token = await AuthService.login(email, password);
      res.json({ token });
    } catch (error) {
      next(error);
    }
  },

  register: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // #swagger.tags = ['Auth']
    // #swagger.summary = 'Cria um novo usuário'
    // #swagger.description = 'Cria um novo usuário com base nos dados fornecidos no corpo da requisição.'
    /* #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados para registro',
          schema: {
              name: 'carlos',
              email: 'carlos@gmail.com',
              password: 'wadawcxa#¨_05#'
          }
    } */
    try {
      const { name, email, password } = req.body as RegisterInput;
      const userId = res.locals.user.id;
      const newUser = await AuthService.register(
        { name, email, password },
        userId
      );
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  },
};
