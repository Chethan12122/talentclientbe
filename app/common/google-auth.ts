import { google } from "googleapis";
import { config } from "./config";
import { logger } from "./logger";

// Load credentials from the service account key JSON
const credentials = config.googleAuth.json || {};
logger.info("credentials", credentials);

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

export const getGoogleSheetsClient = () => {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });

  return google.sheets({ version: "v4", auth });
};
