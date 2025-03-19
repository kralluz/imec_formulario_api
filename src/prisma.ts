import { PrismaClient, Prisma } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const getLogLevels = (): Prisma.LogLevel[] => {
  const logLevelEnv = process.env.LOG_LEVEL || "info";
  return logLevelEnv.split(",").map((level) => level.trim() as Prisma.LogLevel);
};

const getDatabaseUrl = (): string => {
  if (process.env.NODE_ENV === "test") {
    console.log("process.env.TEST_DATABASE_URL", process.env.TEST_DATABASE_URL);
    return (
      process.env.TEST_DATABASE_URL ||
      ""
    );
  }
  return process.env.DATABASE_URL || "";
};

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    log: getLogLevels(),
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: getLogLevels(),
      datasources: {
        db: {
          url: getDatabaseUrl(),
        },
      },
    });
  }
  prisma = global.prisma;
}

const disconnectPrisma = async () => {
  try {
    await prisma.$disconnect();
    return process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

process.on("SIGINT", disconnectPrisma);
process.on("SIGTERM", disconnectPrisma);
process.on("beforeExit", disconnectPrisma);

export default prisma;
