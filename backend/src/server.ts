import app from "./app";
import { env } from "./config/env";
import morgan from "morgan";

process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("⚠️ Uncaught Exception:", error);
});

const PORT = Number(process.env.PORT) || env.port || 5000;
const HOST = "0.0.0.0";

app.use(morgan("dev"));

app.listen(PORT, HOST, () => {
  console.log(`🚀 GIBIConnect Unified Backend Server listening on http://${HOST}:${PORT}`);
  console.log(`📍 API Base: http://${HOST}:${PORT}/api/v1`);
  console.log(`🧠 AI Engine & 6-Stage Tutor: http://${HOST}:${PORT}/api/v1/ai`);
  console.log(`🏥 Health Check: http://${HOST}:${PORT}/api/v1/health`);
});
