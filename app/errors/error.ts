export class BaseError extends Error {
  public statusCode: number;
  public errorCode: string;
  public description: string;

  constructor(statusCode: number, errorCode: string, description: string) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.description = description;
    this.errorCode = errorCode;
  }
}