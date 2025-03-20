# Etapa 1: Build
FROM node:18-bullseye AS builder
WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && \
    apt-get install -y libssl1.1 && \
    rm -rf /var/lib/apt/lists/*

# Copiar package.json e package-lock.json e instalar dependências
COPY package*.json ./
RUN npm install

# Copiar todo o código (incluindo a pasta prisma)
COPY . .

# Compilar a aplicação
RUN npm run build

# Gerar o Prisma Client
RUN npx prisma generate

# Etapa 2: Imagem de produção
FROM node:18-bullseye
WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && \
    apt-get install -y libssl1.1 && \
    rm -rf /var/lib/apt/lists/*

# Configuração para o New Relic somente via ENV
ENV NEW_RELIC_NO_CONFIG_FILE=true

# Copiar e instalar apenas as dependências de produção
COPY package*.json ./
RUN npm install --only=production

# Copiar o Prisma Client gerado (binários e libs do Prisma)
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copiar o código compilado
COPY --from=builder /app/dist ./dist

# Copiar a pasta prisma (schema.prisma e migrations)
COPY --from=builder /app/prisma ./prisma

# Expor a porta 3021
EXPOSE 3021

# Executar as migrações e iniciar a aplicação
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]

