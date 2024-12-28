import express from 'express';
import helmet from 'helmet';
import genericHandler from './errors/error.handler';
import healthzRouter from './routes/healthz.routes';
import authRouter from './routes/auth/index';

const app = express();

// Middlewares
app.use(express.json());
app.use(helmet());

app.use("/api", healthzRouter);
app.use("/api/auth", authRouter);

// Error Handling Middleware
app.use(genericHandler);

export default app;
