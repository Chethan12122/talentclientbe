import { Request, Response, NextFunction } from "express";
import { logger } from "../../common/logger";
import service from "../../service/auth/auth.service";

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    logger.info("Inside user register controller");
    await service.register(req.body);
    res.json("Registration successful");
  } catch (error) {
    logger.error("Error inside Register controller");
    next(error);
  }
}
