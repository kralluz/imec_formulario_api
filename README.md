# IMEC Formulario API

## Sumário

- [Visão Geral](#vis%C3%A3o-geral)
- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pr%C3%A9-requisitos)
- [Instalação](#instala%C3%A7%C3%A3o)
- [Execução](#execu%C3%A7%C3%A3o)
- [Documentação da API](#documenta%C3%A7%C3%A3o-da-api)
- [Testes](#testes)
- [Configuração Inicial](#configura%C3%A7%C3%A3o-inicial)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)

## Visão Geral

A **IMEC Formulario API** é uma API RESTful privada construída com Node.js, Express e TypeScript. O projeto utiliza o Prisma como ORM para interação com o banco de dados PostgreSQL e segue uma arquitetura modular, separando responsabilidades em controllers, middlewares, serviços, rotas e schemas. Essa organização promove robustez, escalabilidade e segurança na aplicação.

## Funcionalidades

- **Autenticação e Autorização**
  - Utiliza JSON Web Tokens (JWT) para autenticação.
  - Suporte a papéis de usuário (ADMIN e COMMON) com controle de acesso diferenciado.
- **Validação de Dados**
  - Uso do Zod para validação e tipagem dos dados de entrada.
- **Segurança**
  - Helmet e CORS configurados para proteção dos cabeçalhos e controle de origens.
  - Rate limiting implementado para evitar abusos em endpoints críticos.
- **Documentação Automática**
  - Swagger gera, de forma dinâmica, a documentação interativa da API.
- **Persistência e ORM**
  - Prisma gerencia as migrações e o mapeamento do banco de dados.
- **Gerenciamento de Erros**
  - Middleware centralizado para tratamento consistente dos erros e respostas apropriadas.

## Estrutura do Projeto

```
IMEC_FORMULARIO_API
├── docs/
├── node_modules/
├── pdf_storage/
│   ├── pdf_174232637445.pdf
│   ├── pdf_174232678933.pdf
│   └── pdf_1742327679607.pdf
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── config/
│   │   └── config.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── questionnaires.controller.ts
│   │   └── submissions.controller.ts
│   ├── Errors/
│   │   └── AppError.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── errorMiddleware.ts
│   │   ├── globals.middleware.ts
│   │   ├── questionnares.middleware.ts
│   │   ├── submissions.middleware.ts
│   │   └── users.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── index.ts
│   │   ├── questionnaires.routes.ts
│   │   ├── questions.routes.ts
│   │   ├── submissions.routes.ts
│   │   └── users.routes.ts
│   ├── schemas/
│   │   ├── auth.schema.ts
│   │   ├── questionnaires.schema.ts
│   │   ├── questions.schema.ts
│   │   ├── submission.schema.ts
│   │   └── users.schema.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── questions.service.ts
│   │   ├── submissions.service.ts
│   │   └── users.service.ts
│   ├── utils/
│   │   └── pdfGenerator.ts
│   ├── app.ts
│   ├── initialConf.ts
│   ├── prisma.ts
│   ├── server.ts
│   └── swagger_output.json
├── .env
├── .env.example
├── .gitignore
├── database.md
├── db_schema.sql
├── Diagrama_Entidade_Relacionamento.png
├── package-lock.json
├── package.json
├── README.md
├── routes.txt
└── tsconfig.json
```

## Pré-requisitos

- Node.js (versão LTS recomendada)
- npm ou yarn
- PostgreSQL configurado conforme as variáveis de ambiente

## Instalação

```sh
# Clonar o repositório
git clone <URL-do-repositório>
cd IMEC_FORMULARIO_API

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env  # Ajuste os valores no .env

# Configurar banco de dados
npx prisma migrate dev
```

## Execução

- **Modo de Desenvolvimento**:
  ```sh
  npm run dev
  ```
- **Build para Produção**:
  ```sh
  npm run build
  npm start
  ```

## Documentação da API

A documentação interativa está disponível via Swagger:

```sh
http://localhost:<PORT>/docs
```

## Testes

- Se houver testes automatizados, adicione as instruções aqui.
- Para executar os testes:
  ```sh
  npm test
  ```

## Configuração Inicial

O arquivo `initialConf.ts` realiza as configurações iniciais e garante o desligamento adequado do Prisma após a inicialização.

## Tecnologias Utilizadas

- **Node.js, Express e TypeScript**
- **Prisma** para ORM e migrações
- **Swagger** para documentação interativa
- **Zod** para validação de dados
- **Helmet, CORS, Bcrypt e JWT** para segurança e autenticação
