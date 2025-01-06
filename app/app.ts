import express from "express";
import helmet from "helmet";
import genericHandler from "./errors/error.handler";
import healthzRouter from "./routes/healthz.routes";
import authRouter from "./routes/auth/index";
import seasonRouter from "./routes/season/index";
import userRouter from "./routes/user/index";
import teamRouter from "./routes/team/index";
import { CORS_OPTIONS } from "./common/constants";
import cors from "cors";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors(CORS_OPTIONS));
app.use(helmet());

app.use("/api", healthzRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/season", seasonRouter);
app.use("/api/team", teamRouter);

// Error Handling Middleware
app.use(genericHandler);

export default app;
