import { Request, Response, NextFunction } from "express";
import { SubmissionsService } from "../services/submissions.service";

export const SubmissionsController = {
  submitForm: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // #swagger.tags = ['Submissions']
    // #swagger.summary = 'Submete um formulário'
    // #swagger.description = 'Processa os dados do formulário enviado, gerando um registro PDF correspondente.'
    /* #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados do formulário para submissão',
          schema: {
            // Exemplo de dados:
            // nome: "João Silva",
            // email: "joao.silva@example.com",
            // respostas: [ { perguntaId: "uuid", resposta: "texto" }, ... ]
          }
    } */
    try {
      const submissionData = req.body;
      const pdfRecord = await SubmissionsService.processSubmission(
        submissionData
      );
      res.status(201).json(pdfRecord);
    } catch (error) {
      next(error);
    }
  },

  getPdfById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // #swagger.tags = ['Submissions']
    // #swagger.summary = 'Obtém PDF por ID'
    // #swagger.description = 'Retorna o arquivo PDF associado ao ID fornecido.'
    // #swagger.parameters['id'] = { description: 'ID do PDF a ser obtido' }
    try {
      const fileBuffer = await SubmissionsService.getPdfFileById();
      res.setHeader("Content-Type", "application/pdf");
      res.send(fileBuffer);
    } catch (error) {
      next(error);
    }
  },

  getPdfsByQuestionnaire: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // #swagger.tags = ['Submissions']
    // #swagger.summary = 'Obtém PDFs por questionário'
    // #swagger.description = 'Retorna todos os registros PDF associados ao questionário informado.'
    /* #swagger.parameters['body'] = {
          in: 'body',
          description: 'ID do questionário para buscar os PDFs',
          schema: { questionnaireId: "UUID do questionário" }
    } */
    try {
      const { questionnaireId } = req.body;
      const pdfRecords = await SubmissionsService.getPdfsByQuestionnaire(
        questionnaireId
      );
      res.json(pdfRecords);
    } catch (error) {
      next(error);
    }
  },

  verifyPdf: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // #swagger.tags = ['Submissions']
    // #swagger.summary = 'Verifica assinatura de PDF'
    // #swagger.description = 'Verifica se a assinatura do PDF associado ao ID informado é válida.'
    // #swagger.parameters['id'] = { description: 'ID do PDF a ser verificado' }
    try {
      const { id } = req.params;
      const isValid = await SubmissionsService.verifyPdfSignature(id);
      res.json({ valid: isValid });
    } catch (error) {
      next(error);
    }
  },
};
