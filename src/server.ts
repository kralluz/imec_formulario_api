// src/server.ts
import app from "./app";
import initialConfig from "./initialConf";

const handleError = (err: NodeJS.ErrnoException): void => {
  process.exit(1);
};

const startServer = (): void => {
  initialConfig();

  const PORT = parseInt(process.env.PORT || "3004", 10);
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `Server is running on http://localhost:${PORT}/docs`
    );
  });
  

  server.on("error", handleError);
};

startServer();
