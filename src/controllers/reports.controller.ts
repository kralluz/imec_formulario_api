import { Request, Response, NextFunction } from "express";
import {
  analyticsQuerySchema,
  logsQuerySchema,
} from "../schemas/reports.schema";
import { ReportsService } from "../services/reports.service";

export const ReportsController = {
  getAuditLogs: async (req: Request, res: Response, next: NextFunction) => {
    // #swagger.tags = ['Reports']
    // #swagger.summary = 'Retorna os logs de auditoria'
    // #swagger.description = 'Retorna os logs de auditoria com base nos filtros fornecidos como parâmetros de query.'
    /* #swagger.parameters['query'] = {
          in: 'query',
          description: 'Filtros para logs de auditoria',
          schema: {
              tableName: 'nome_da_tabela',
              action: 'ação realizada',
              startDate: '2021-01-01T00:00:00.000Z',
              endDate: '2021-01-31T23:59:59.999Z',
              limit: '10',
              offset: '0'
          }
    } */
    try {
      const query = logsQuerySchema.parse(req.query);
      const logs = await ReportsService.getAuditLogs(query);
      res.json(logs);
    } catch (error) {
      next(error);
    }
  },

  getAnalytics: async (req: Request, res: Response, next: NextFunction) => {
    // #swagger.tags = ['Reports']
    // #swagger.summary = 'Retorna os relatórios de analytics'
    // #swagger.description = 'Retorna os relatórios de analytics com base nos filtros fornecidos como parâmetros de query.'
    /* #swagger.parameters['query'] = {
          in: 'query',
          description: 'Filtros para os relatórios de analytics',
          schema: {
              questionnaireId: 'uuid do questionário',
              startDate: '2021-01-01T00:00:00.000Z',
              endDate: '2021-01-31T23:59:59.999Z',
              limit: '10',
              offset: '0'
          }
    } */
    try {
      const query = analyticsQuerySchema.parse(req.query);
      const analytics = await ReportsService.getAnalytics(query);
      res.json(analytics);
    } catch (error) {
      next(error);
    }
  },
};
