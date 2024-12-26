import app from './app';
import { config } from './common/config';
import { logger } from './common/logger';

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});