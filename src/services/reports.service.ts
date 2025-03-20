import prisma from "../prisma";

interface LogsQuery {
  tableName?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  limit?: string;
  offset?: string;
}

interface AnalyticsQuery {
  questionnaireId?: string;
  startDate?: string;
  endDate?: string;
  limit?: string;
  offset?: string;
}

export const ReportsService = {
  getAuditLogs: async (query: LogsQuery) => {
    const filters: Record<string, any> = {};

    if (query.tableName) {
      filters.tableName = query.tableName;
    }
    if (query.action) {
      filters.action = query.action;
    }
    if (query.startDate) {
      filters.createdAt = {
        ...(filters.createdAt || {}),
        gte: new Date(query.startDate),
      };
    }
    if (query.endDate) {
      filters.createdAt = {
        ...(filters.createdAt || {}),
        lte: new Date(query.endDate),
      };
    }

    const limit = query.limit ? parseInt(query.limit, 10) : undefined;
    const offset = query.offset ? parseInt(query.offset, 10) : undefined;

    const auditLogs = await prisma.auditLog.findMany({
      where: filters,
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
    });
    return auditLogs;
  },

  getAnalytics: async (query: AnalyticsQuery) => {
    const filters: Record<string, any> = {};

    if (query.questionnaireId) {
      filters.questionnaireId = query.questionnaireId;
    }
    if (query.startDate) {
      filters.createdAt = {
        ...(filters.createdAt || {}),
        gte: new Date(query.startDate),
      };
    }
    if (query.endDate) {
      filters.createdAt = {
        ...(filters.createdAt || {}),
        lte: new Date(query.endDate),
      };
    }

    const limit = query.limit ? parseInt(query.limit, 10) : undefined;
    const offset = query.offset ? parseInt(query.offset, 10) : undefined;

    const analytics = await prisma.analytics.findMany({
      where: filters,
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
    });
    return analytics;
  },
};
