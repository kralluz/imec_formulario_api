import { Router } from "express";
import { ReportsController } from "../controllers/reports.controller";

const router = Router();

// Rota para obter os logs de auditoria
router.get("/logs", ReportsController.getAuditLogs);

// Rota para obter os relatórios de analytics
router.get("/analytics", ReportsController.getAnalytics);

export default router;
