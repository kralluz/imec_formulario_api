import express from "express";
import statusMonitor from "express-status-monitor";
import authRouter from "./auth.routes";
import userRouter from "./users.routes";
import questionnairesRouter from "./questionnaires.routes";
import questionsRouter from "./questions.routes";
import submissionsRouter from "./submissions.routes";

const router = express.Router();

const monitorOptions = {
  title: "Dashboard de Saúde da API",
};
const monitorMiddleware = statusMonitor(monitorOptions);

router.use(monitorMiddleware);

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/questionnaires", questionnairesRouter);
router.use("/questions", questionsRouter);
router.use("/submissions", submissionsRouter);

router.get("/health", async (req, res) => {
  // #swagger.tags = ['Health']
  // #swagger.summary = 'Verifica a saúde da aplicação'
  // #swagger.description = 'Retorna informações detalhadas sobre o status e métricas da aplicação, incluindo uptime, uso de memória, versão e timestamp.'
  try {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    const version = process.env.npm_package_version || "versão desconhecida";
    const timestamp = new Date().toISOString();

    res.status(200).json({
      status: "ok",
      uptime,
      memoryUsage,
      version,
      timestamp,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      error: error.message,
    });
  }
});

export default router;
