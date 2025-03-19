// src/config/initialConfig.ts
import prisma from "./prisma";

const initialConfig = async () => {
  try {
    console.log(
      "Iniciando configuração inicial............................"
    );

    console.log("🎉 Configuração inicial concluída com sucesso.");
  } catch (error: any) {
    console.error(
      "⚠️ Erro durante a configuração inicial:",
      error.message || error
    );
    process.exit(1);
  } finally {
    try {
      await prisma.$disconnect();
      console.log("🔌 Desconectado do banco de dados.");
    } catch (disconnectError) {
      console.error(
        "❌ Erro ao desconectar do banco de dados:",
        disconnectError
      );
    }
  }
};

export default initialConfig;
