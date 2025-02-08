import convict from "convict";

const configuration = convict({
  port: {
    doc: "The PORT backend binds to",
    format: "port",
    default: 5000,
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
  urls: {
    resetPasswordUrl: {
      doc: "Reset Password Url",
      format: String,
      default: "http://localhost:5173/reset-password",
      env: "RESET_PASSWORD_URL",
      arg: "reset_password_url",
    },
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
      default:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2ZGxtbG9laHlvZWNpdGhycWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NDE2NzYsImV4cCI6MjA1MDExNzY3Nn0.HZmRK59JXcCinYedTidzr9ASr6_8MZTtFP93D9MhRAI",
      env: "SUPABASE_KEY",
      arg: "supabase_key",
    },
  },
  googleAuth: {
    json: {
      doc: "Google auth json",
      format: Object,
      default: {
        type: "service_account",
        project_id: "talent-identification-448810",
        private_key_id: "8aa4748090216e44cdb78b8b69d0d068d7396a2f",
        private_key:
          "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDHO/82PINEHaAl\n66kPW52Y7HhYbRfIhJLGfw4paP6jz2q29umqUhRKxDGB2goQ8lwv/waqFfN8C97O\nAMrol7fbDTg1oUuX54etfEKq+tUAFbf0tnCEwywJQtXQ1Vbcj/MyP/B1iGZOoak0\nPAKlz/4gu9NQj76szJIcus2303KAfXU2vuhFOeb5TqWQ/TaVpSvFbWMuEbmgr03m\nxWhY6uwhQvGotRwJ139PLvimvkC8I2XIwpSnLb5lLY7844rnCReMt6Ss6q8mTPx8\nz+mhg/fB6vDeNNGwZVGnT9WG+yONRPaFGXDSW00JFUX6mj3ySvyiEqzHMOs0Wuft\nrg/BYBbVAgMBAAECggEAEjPBi894gKsiPAStQ+lvWw7TqeSBpUCzdi4aeZ8NkKK9\nEa06SOTJ1NDa4w2sGMNDt+DZV4W84orlFrYM07Y0xm8NQR0U3nJ5O1jccGmNNz5E\nubdHTWHVbp0sErHDB1Che+hKjDpjenCbmFmZNlPr2ErAsh4H4hqoiLZqYA6R6foi\n6b0r9Bwil1U0ur6adBTUZIEE8/BZSR88PMja35jgufzVgIMhveEJ6gAzz176Chkn\n6ysggcsUQPCMxwaJM6RyGDiN3shmYXHPBfl3WZ/jkcV9fPGJaOTI1JPOGsZlE0fn\n1LxXsiHMJh2+HEkvfbSIAF3CN4gj0tG7vFaQL1lM0QKBgQD088ku6TEx8eGy589U\nhNKXO6uy2t/HR0ddne0ciQ4cAnWBh2CIjkTioTRBAmuvAowc195lYFcWJqb7fpcO\niHIZ9E0Z2jfAutvuwh1cEJucM8JsrhXXCnMYfvRnBXu3i7J5BE+dhrvCV83/sWV4\nK/6u8wZGQzjqeo9Hq982kDy97QKBgQDQOFpR8VVRHDaqtH7KMzqVraHm1yBdTdF8\ntwXCluaydB516KbkNIAr+UnjP+X+r0zCzWbyE0V6Y03UepZFw0X1Vh32fS0I5GO3\nGBOSwcniyOxpfWak3J9aYn/JouPXFJP15a879mlLSheSIihRnKcsBJzpSvtCKkiI\n2GGFX4HfiQKBgGW+1XQs3IhYZl1/uDjtKuQynvEdxRHrY5NZQ+I0c63iv5hb+Rb/\nsVFJkIDoVn5NWpGogPIvAD1tNLMGNAyPVIW/Wj9AyyO8+hnEe5mANIK/ZSTrcprt\n9jzYjwAz4N2uoyVtSvytuFPTUPfCYdl2vMVCoPqSdZO/8L/efksVwoVJAoGBAMh9\nenpsZjozcG/uXCdWLJLzHXGoswEkbRIpKOK1am1qYeommowiAUhWQU8Pt+YD5WWt\nYfK1m7C87bQqVYfW/wW8Zh1xamulfl5OUIp/DmXQEdOBa9RSmx3suh7tOXVf2xhq\nkNCr87cLIKcVPL1YmZ9I0c3Q5R5QmIcr0rsZu3QBAoGBAKIktWk0hQ9Y8RSNyb35\n4PTj07acH+Nh2572rYfAmb48XLm9SzBp7kVhNusMtcy6eH9NG1X4sigDZQMHd35p\nTlKNN8VZujFYu19fpU5O7UVHAs+x1ZfvVWMTzp00QEDhsFLq9tGN40fU60JMr20h\nGjdwSmbzWIB0LnJ4p9Nd3KMv\n-----END PRIVATE KEY-----\n",
        client_email:
          "talent@talent-identification-448810.iam.gserviceaccount.com",
        client_id: "102006378849630803807",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url:
          "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url:
          "https://www.googleapis.com/robot/v1/metadata/x509/talent%40talent-identification-448810.iam.gserviceaccount.com",
        universe_domain: "googleapis.com",
      },
      env: "GOOGLE_AUTH_JSON",
    },
    sheet_id: {
      doc: "Sheet ID",
      format: String,
      default: "1ArJ2aMcgysPsa5-1UZjydg-0iPNbsukGTD7pNRyl2KE",
      env: "GOOGLE_SHEET_ID",
    },
    sheet_name: {
      doc: "Sheet Name",
      format: String,
      default: "Sheet1",
      env: "GOOGLE_SHEET_NAME",
    },
  },
});

configuration.validate({ allowed: "strict" });

export const config = configuration.get();
