import { HTTP_STATUS } from "../constants";
import { Request, Response } from "express";

function methodNotAllowed(req: Request, res: Response): void {
  res.status(405).send(HTTP_STATUS.METHOD_NOT_FOUND);
}

export { methodNotAllowed };
