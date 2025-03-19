import PDFDocument from "pdfkit";
import fs from "fs/promises";
import path from "path";
import axios from "axios";
import { SubmissionInput } from "../schemas/submission.schema";
import { AppError } from "../Errors/AppError";

// Diretório para armazenamento seguro dos PDFs
const pdfDirectory = path.join(__dirname, "../../pdf_storage");

// Função para garantir que o diretório exista
export const ensurePdfDirectoryExists = async (): Promise<void> => {
  try {
    await fs.mkdir(pdfDirectory, { recursive: true });
  } catch (error) {
    console.error("Erro ao criar o diretório pdf_storage:", error);
    throw new AppError("Erro interno ao preparar o armazenamento de PDFs", 500);
  }
};

/**
 * Converte uma stream em Buffer.
 */
const streamToBuffer = (stream: NodeJS.ReadableStream): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", (err) => reject(err));
  });
};

/**
 * Baixa a imagem da URL e retorna um Buffer.
 * Se ocorrer erro, retorna undefined.
 */
const getImageBufferFromUrl = async (
  url: string
): Promise<Buffer | undefined> => {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return Buffer.from(response.data, "binary");
  } catch (error) {
    console.error("Erro ao baixar imagem da URL:", error);
    return undefined;
  }
};

/**
 * Adiciona o cabeçalho em cada página.
 */
const addHeader = (doc: PDFKit.PDFDocument, logoBuffer?: Buffer) => {
  const innerPadding = 15;
  // Cálculo da área de conteúdo (garante alinhamento com o corpo da página)
  const contentLeft = doc.page.margins.left + innerPadding;
  const contentRight = doc.page.width - doc.page.margins.right - innerPadding;
  const contentWidth = contentRight - contentLeft;

  // Exibe a logo à esquerda com tamanho maior, posicionada dentro da área de conteúdo
  if (logoBuffer) {
    try {
      doc.image(logoBuffer, contentLeft, 10, { width: 150 });
    } catch (error) {
      console.error("Erro ao carregar a logo:", error);
    }
  }

  // Define as strings para data/hora e endereço
  const headerDate = `Data/Hora: ${new Date().toLocaleString()}`;
  const headerAddress =
    "Endereço: Rua Leopoldina Salgado, n.º203, Centro, Ceres - GO";

  // Define área para textos à direita
  const textAreaWidth = 240; // ajuste conforme necessário
  const textAreaX = contentRight - textAreaWidth;

  // Data/Hora na primeira linha, alinhado à direita
  doc
    .fontSize(10)
    .fillColor("black")
    .text(headerDate, textAreaX, 10, { width: textAreaWidth, align: "right" });

  // Endereço na segunda linha, alinhado à direita
  doc.text(headerAddress, textAreaX, 25, {
    width: textAreaWidth,
    align: "right",
  });

  // Linha separadora abaixo do header (alinhada com a área de conteúdo)
  doc
    .moveTo(contentLeft, 60)
    .lineTo(contentRight, 60)
    .stroke();
};

/**
 * Adiciona o rodapé em cada página.
 */
const addFooter = (
    doc: PDFKit.PDFDocument,
    deviceInfo: any,
    ip: string,
    cnpj: string
  ) => {
    const innerPadding = 15;
    const contentLeft = doc.page.margins.left + innerPadding;
    const contentRight = doc.page.width - doc.page.margins.right - innerPadding;
    const contentWidth = contentRight - contentLeft;
    const footerText = `Data/Hora: ${new Date().toLocaleString()} | IP: ${ip} | CNPJ: ${cnpj} – IMEC Diagnostico`;
  
    // Define a posição fixa para o footer, por exemplo, 40 unidades acima do final da página
    const footerY = doc.page.height - 40;
  
    // Imprime o footer na posição definida
    doc.fontSize(8).text(footerText, contentLeft, footerY, {
      width: contentWidth,
      align: "center",
    });
  };
  
  

/**
 * Gera um PDF formatado com duas páginas:
 * - Página 1: Dados do questionário e do paciente.
 * - Página 2: Termo de consentimento e área para assinatura.
 *
 * @param data - Dados da submissão.
 */
export const generateFormattedPDF = async (
  data: SubmissionInput
): Promise<Buffer> => {
  // Tenta obter a logo, se fornecida
  let logoBuffer: Buffer | undefined = undefined;
  if (data.additionalData && (data.additionalData as any).logoUrl) {
    logoBuffer = await getImageBufferFromUrl(
      (data.additionalData as any).logoUrl
    );
  }

  // Converte a assinatura base64 para Buffer (se fornecida)
  let signatureBuffer: Buffer | undefined = undefined;
  if (data.formData.signature && data.formData.signature.trim() !== "") {
    if (data.formData.signature.startsWith("data:image")) {
      const base64Data = data.formData.signature.split(",")[1];
      signatureBuffer = Buffer.from(base64Data, "base64");
    } else {
      signatureBuffer = Buffer.from(data.formData.signature, "base64");
    }
  }

  // Cria o documento PDF com autoFirstPage desabilitado
  const doc = new PDFDocument({ autoFirstPage: false, margin: 50 });

  // === Página 1: Questionário e Dados do Paciente ===
  doc.addPage(); // Agora doc.page está definido
  addHeader(doc, logoBuffer);
  doc.moveDown(2);

  // Cálculo da área de conteúdo para a página (após addPage)
  const innerPadding = 15;
  const contentLeft = doc.page.margins.left + innerPadding;
  const contentRight = doc.page.width - doc.page.margins.right - innerPadding;
  const contentWidth = contentRight - contentLeft;

  // Título alinhado à esquerda dentro da área de conteúdo
  doc
    .fontSize(20)
    .text("Formulário de Questionário e Consentimento", contentLeft, undefined, {
      align: "left",
      width: contentWidth,
    });
  doc.moveDown();

  // Dados do paciente alinhados à esquerda
  doc
    .fontSize(12)
    .text(`Nome: ${data.additionalData?.patientName || "N/A"}`, contentLeft, undefined, {
      align: "left",
      width: contentWidth,
    })
    .text(`CPF: ${data.additionalData?.cpf || "N/A"}`, contentLeft, undefined, {
      align: "left",
      width: contentWidth,
    })
    .text(
      `Data de Nascimento: ${data.additionalData?.birthDate || "N/A"}`,
      contentLeft,
      undefined,
      { align: "left", width: contentWidth }
    )
    .text(`Idade: ${data.additionalData?.age || "N/A"}`, contentLeft, undefined, {
      align: "left",
      width: contentWidth,
    });
  doc.moveDown();

  // Respostas do questionário com linha pontilhada, alinhadas à esquerda
  data.formData.responses.forEach((resp) => {
    doc.text(`Pergunta (${resp.question}): ${resp.answer}`, contentLeft, undefined, {
      align: "left",
      width: contentWidth,
    });
    doc.moveDown(0.5);
    doc
      .moveTo(contentLeft, doc.y)
      .lineTo(contentRight, doc.y)
      .dash(5, { space: 5 })
      .stroke()
      .undash();
    doc.moveDown();
  });

  addFooter(
    doc,
    data.deviceInfo,
    data.networkInfo?.ip || "",
    "20.714.637/0001-57"
  );

  // === Página 2: Termo e Assinatura ===
  doc.addPage();
  addHeader(doc, logoBuffer);
  doc.moveDown(2);

  // Recalcula a área de conteúdo para a nova página
  const innerPadding2 = 15;
  const contentLeft2 = doc.page.margins.left + innerPadding2;
  const contentRight2 = doc.page.width - doc.page.margins.right - innerPadding2;
  const contentWidth2 = contentRight2 - contentLeft2;

  // Título alinhado à esquerda
  doc
    .fontSize(20)
    .text("Termo e Assinatura", contentLeft2, undefined, {
      align: "left",
      width: contentWidth2,
    });
  doc.moveDown();

  // Texto do termo de consentimento alinhado à esquerda
  doc
    .fontSize(12)
    .text(
      "Termo de Consentimento para o Uso de Contraste em Exames de Tomografia:",
      contentLeft2,
      undefined,
      { align: "left", width: contentWidth2 }
    )
    .moveDown()
    .text(
      "Gravidez: Raios-x podem ser prejudiciais, principalmente no início da gestação.",
      contentLeft2,
      undefined,
      { align: "left", width: contentWidth2 }
    )
    .moveDown()
    .text(
      "Utilização do contraste endovenoso: O contraste contém iodo, realça estruturas vasculares e, raramente, pode causar reações alérgicas.",
      contentLeft2,
      undefined,
      { align: "left", width: contentWidth2 }
    )
    .moveDown()
    .text(
      "Confirmo que estou ciente e concordo com o procedimento, que será acompanhado por equipe médica especializada.",
      contentLeft2,
      undefined,
      { align: "left", width: contentWidth2 }
    );
  doc.moveDown(2);

  // Exibe a assinatura, se disponível
  if (signatureBuffer) {
    try {
      doc.image(signatureBuffer, contentLeft2, doc.y, { width: 100 });
    } catch (error) {
      console.error("Erro ao carregar a assinatura:", error);
    }
  }

  addFooter(
    doc,
    data.deviceInfo,
    data.networkInfo?.ip || "",
    "20.714.637/0001-57"
  );

  // Finaliza o documento e converte a stream em Buffer
  doc.end();
  const pdfBuffer = await streamToBuffer(doc);
  return pdfBuffer;
};
