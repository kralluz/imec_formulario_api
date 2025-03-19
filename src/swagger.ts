import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Conecta IMEC API Documentation",
    description:
      "Documentação automática gerada pelo Swagger para a API do Conecta IMEC",
    version: "1.9.36",
  },
  host: "localhost:3004",
  basePath: "/",
  schemes: ["http"],
  securityDefinitions: {
    JWT: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description:
        "Insira o token JWT no cabeçalho da requisição (ex: 'Bearer {token}')",
    },
  },
  tags: [
    {
      name: "Auth",
      description: "Endpoints relacionados à autenticação e autorização",
    },
    {
      name: "Users",
      description: "Endpoints relacionados aos usuários",
    },
    {
      name: "Questionnaires",
      description: "Endpoints relacionados aos questionários",
    },
    {
      name: "Questions",
      description: "Endpoints relacionados às questões",
    },
    {
      name: "Submissions",
      description: "Endpoints relacionados aos envios (respostas)",
    },
    {
      name: "Health",
      description: "Verificação de saúde da API",
    },
  ],
  definitions: {
    User: {
      id: "uuid",
      name: "Jhon Doe",
      email: "jhondoe@email.com",
      role: "COMMON",
      createdAt: "2023-01-01T00:00:00Z",
    },
    Questionnaire: {
      id: "uuid",
      title: "Questionário de Exemplo",
      icon: "http://example.com/icon.png",
      userId: "uuid",
      createdAt: "2023-01-01T00:00:00Z",
    },
    Question: {
      id: "uuid",
      questionnaireId: "uuid",
      parentQuestionId: "uuid",
      triggerValue: "Valor disparador (opcional)",
      orderIndex: 1,
      text: "Texto da pergunta",
      type: "text",
      createdAt: "2023-01-01T00:00:00Z",
    },
    Option: {
      id: "uuid",
      questionId: "uuid",
      label: "Opção A",
      value: "valorA",
      createdAt: "2023-01-01T00:00:00Z",
    },
    Submission: {
      deviceInfo: {
        deviceId: "opcional",
        ip: "127.0.0.1",
        userAgent: "Mozilla/5.0",
      },
      networkInfo: {
        ip: "127.0.0.1",
      },
      origin: "http://example.com",
      formData: {
        questionnaireId: "uuid",
        responses: [
          {
            question: "Texto da pergunta",
            answer: "Resposta da pergunta",
          },
        ],
        signature: "Assinatura da submissão",
      },
      additionalData: {
        patientName: "Nome do paciente",
        cpf: "000.000.000-00",
        birthDate: "2000-01-01",
        age: "25",
        logoUrl: "http://example.com/logo.png",
      },
    },
  },
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./routes/index.ts"];

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
  console.log("Swagger documentation generated successfully!");
});
