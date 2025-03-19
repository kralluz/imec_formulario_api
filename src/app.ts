// src/app.ts
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";

import { errorHandler } from "./middlewares/errorMiddleware";

import swaggerFile from "./swagger_output.json";
import swaggerUi from "swagger-ui-express";
import router from "./routes";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(router);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

export default app;
