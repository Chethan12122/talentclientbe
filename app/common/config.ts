import convict from 'convict';

const configuration = convict({
  port: {
    doc: "The PORT backend binds to",
    format: "port",
    default: 5001,
    env: "PORT",
    arg: "port",
  },
  swagger: {
    doc: "Swagger UI",
    default: true,
    env: "SWAGGER_UI",
  },
  baseUrl: {
    doc: "Base Url",
    format: String,
    default: "http://localhost:5173",
    env: "BASE_URL",
    arg: "base_url",
  },
  nodeEnv: {
    doc: "The application environment",
    format: ["development", "production", "test"],
    default: "development",
    env: "NODE_ENV",
  },
});

configuration.validate({ allowed: "strict" });

export const config = configuration.get();
