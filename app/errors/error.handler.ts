/* eslint-disable @typescript-eslint/no-unused-vars */
import { logger } from "../common/logger";
import { ApplicationStaticErrors } from "./application.error";
import { BaseError } from "./error";

class ErrorResponse {
  public error: boolean;
  public code: string;
  public message: string;

  constructor(code: string, message: string) {
    this.error = true;
    this.code = code;
    this.message = message;
  }
}

// Define a more specific type for error (e.g., BaseError | any object with specific properties)
type ErrorType = BaseError | { errorCode: string, statusCode: number, description: string };

function genericHandler(
  error: ErrorType,
  req: { url?: string }, 
  res: { status: (code: number) => { json: (body: ErrorResponse) => void } }, 
  next: unknown // Avoid using `Function`, use `unknown` instead
): void {
  logger.error(
    `Failed to process the URL :: ${req?.url} error :: ${error?.stack}`
  );

  let statusCode = ApplicationStaticErrors.SOMETHING_WENT_WRONG.statusCode;
  let errorCode = ApplicationStaticErrors.SOMETHING_WENT_WRONG.errorCode;
  let description = ApplicationStaticErrors.SOMETHING_WENT_WRONG.description;

  if (
    error instanceof BaseError ||
    error?.errorCode &&
      error?.statusCode &&
      error?.statusCode !== 500 &&
      error?.description
  ) {
    statusCode = error.statusCode;
    errorCode = error.errorCode;
    description = error.description;
  }

  res.status(statusCode).json(new ErrorResponse(errorCode, description));
}

export default genericHandler;
