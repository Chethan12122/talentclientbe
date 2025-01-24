import { google } from "googleapis";
import { config } from "./config";

// Load credentials from the service account key JSON
const credentials = config.googleAuth.json || {};

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

export const getGoogleSheetsClient = () => {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });

  return google.sheets({ version: "v4", auth });
};
