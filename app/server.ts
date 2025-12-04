import app from './app';
import { config } from './common/config';
import { logger } from './common/logger';

const PORT = config.port;

app.listen(PORT, () => {
  logger.info("====================================================");
  logger.info("🚀  Talent Identification BFF Service Started!");
  logger.info(`🌍  Environment : ${config.nodeEnv}`);
  logger.info(`🔗  Listening   : http://localhost:${PORT}`);
  logger.info("====================================================");
});