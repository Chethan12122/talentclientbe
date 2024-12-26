import { BaseError } from "./error";

export class RetryableException extends BaseError {
  constructor(error: { statusCode: number; errorCode: string; description: string }) {
    super(error.statusCode, error.errorCode, error.description);
  }
}

export class NonRetryableException extends BaseError {
  constructor(error: { statusCode: number; errorCode: string; description: string }) {
    super(error.statusCode, error.errorCode, error.description);
  }
}
