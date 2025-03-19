import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import prisma from "../prisma";
import { SubmissionInput } from "../schemas/submission.schema";
import { AppError } from "../Errors/AppError";
import {
  generateFormattedPDF,
  ensurePdfDirectoryExists,
} from "../utils/pdfGenerator";

const pdfDirectory = path.join(__dirname, "../../pdf_storage");

export const SubmissionsService = {
  processSubmission: async (data: SubmissionInput): Promise<any> => {
    if (
      !data.formData ||
      !data.formData.questionnaireId ||
      !data.formData.signature
    ) {
      throw new AppError("Dados do formulário incompletos", 400);
    }

    const pdfBuffer = await generateFormattedPDF(data);

    const signatureHash = crypto
      .createHash("sha256")
      .update(data.formData.signature)
      .digest("hex");

    const fileName = `pdf_${Date.now()}.pdf`;
    const filePath = path.join(pdfDirectory, fileName);

    await ensurePdfDirectoryExists();

    try {
      await fs.writeFile(filePath, pdfBuffer);
    } catch (error) {
      console.error("Erro ao salvar o PDF:", error);
      throw new AppError("Erro ao salvar o PDF", 500);
    }

    try {
      const pdfRecord = await prisma.pdfFile.create({
        data: {
          questionnaireId: data.formData.questionnaireId,
          filePath: filePath,
          signatureHash: signatureHash,
          signatureAt: new Date(),
        },
      });
      return pdfRecord;
    } catch (error) {
      throw new AppError("Houve um erro", 500);
    }
  },

  getPdfFileById: async (): Promise<any> => {
    const pdfRecord = await prisma.pdfFile.findMany();
    if (!pdfRecord) {
      throw new AppError("PDF não encontrado", 404);
    }
    try {
      console.log()
      return pdfRecord;
    } catch (error) {
      console.error("Erro ao ler o PDF:", error);
      throw new AppError("Erro ao ler o PDF", 500);
    }
  },

  getPdfsByQuestionnaire: async (questionnaireId: string): Promise<any[]> => {
    const pdfRecords = await prisma.pdfFile.findMany({
      where: { questionnaireId },
    });
    return pdfRecords;
  },

  verifyPdfSignature: async (id: string): Promise<boolean> => {
    const pdfRecord = await prisma.pdfFile.findUnique({ where: { id } });
    if (!pdfRecord) {
      throw new AppError("PDF não encontrado", 404);
    }
    return !!pdfRecord.signatureHash;
  },
};
