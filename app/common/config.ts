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
  supabase: {
    url: {
      doc: "Supabase url",
      format: String,
      default: "https://gvdlmloehyoecithrqer.supabase.co",
      env: "SUPABASE_URL",
      arg: "supabase_url",
    },
    key: {
      doc: "Supabase key",
      format: String,
      default: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2ZGxtbG9laHlvZWNpdGhycWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NDE2NzYsImV4cCI6MjA1MDExNzY3Nn0.HZmRK59JXcCinYedTidzr9ASr6_8MZTtFP93D9MhRAI",
      env: "SUPABASE_KEY",
      arg: "supabase_key",
    }
  }
});

configuration.validate({ allowed: "strict" });

export const config = configuration.get();
