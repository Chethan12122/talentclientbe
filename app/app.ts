import express from 'express';
import helmet from 'helmet';
import genericHandler from './errors/error.handler';

const app = express();

// Middlewares
app.use(express.json());
app.use(helmet());


// Error Handling Middleware
app.use(genericHandler);

export default app;
