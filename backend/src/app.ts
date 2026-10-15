import express from "express";
import cors from "cors";
import helmet from "helmet";
import { checkDatabaseConnection } from "./config/database";
import { errorHandler } from "./middleware/error.middleware";
import institutionRoutes from "./modules/institutions/routes/institution.routes";
import programRoutes from "./modules/programs/routes/program.routes";
import admissionRoutes from "./modules/admissions/routes/admission.routes";
import resourceRoutes from "./modules/resources/routes/resource.routes";
import financeRoutes from "./modules/finance/routes/finance.routes";
import authRoutes from "./modules/auth/routes/auth.routes";
import userRoutes from "./modules/users/routes/user.routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/v1/institutions", institutionRoutes);
app.use("/api/v1/programs", programRoutes);
app.use("/api/v1/admissions", admissionRoutes);
app.use("/api/v1/resources", resourceRoutes);
app.use("/api/v1/finance", financeRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

app.get("/api/v1/health", async (_req, res): Promise<void> => {
  try {
    await checkDatabaseConnection();

    res.json({
      success: true,
      data: {
        application: "running",
        database: "available",
      },
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(503).json({
      success: false,
      error: {
        code: "DATABASE_UNAVAILABLE",
        message: "The application is running, but the database is unavailable",
      },
      timestamp: new Date().toISOString(),
    });
  }
});

app.use(errorHandler);

export default app;