import { Request, Response, NextFunction } from "express";
import { logger } from "../../common/logger";
import service from "../../service/auth/auth.service";
import { NonRetryableException } from "../../errors/base.error";
import { ApplicationStaticErrors } from "../../errors/application.error";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await service.register(req.body);
    res.json({
      message:
        "User registered successfully. Otp has been sent to your phone number",
    });
  } catch (error) {
    logger.error("Error inside Register controller");
    next(error);
  }
}

export async function verify(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await service.verify(req.body);
    res.json({
      data: response,
      message: "User verified successfully",
    });
  } catch (error) {
    logger.error("Error inside Verify controller");
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await service.login(req.body);
    res.json({
      data: response,
      message: "User logged in successfully",
    });
  } catch (error) {
    logger.error("Error inside Login controller");
    next(error);
  }
}

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const access_token = req.headers.authorization?.split(" ")[1];
    const refresh_token = req.body.refresh_token;
    if (!access_token || !refresh_token) {
      throw new NonRetryableException(ApplicationStaticErrors.UNAUTHORIZED);
    }
    await service.logout({ access_token, refresh_token });
    res.json({
      message: "User logged out successfully",
    });
  } catch (error) {
    logger.error("Error inside Logout controller");
    next(error);
  }
}

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const access_token: string = req.headers.authorization?.split(" ")[1] || "";
    if (!access_token)
      throw new NonRetryableException(ApplicationStaticErrors.UNAUTHORIZED);
    const response = await service.verifyToken(access_token);
    if (!response)
      throw new NonRetryableException(ApplicationStaticErrors.UNAUTHORIZED);

    next();
  } catch (error) {
    logger.error("Error inside Get Login Status controller" + error);
    next(new NonRetryableException(ApplicationStaticErrors.UNAUTHORIZED));
  }
}

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const refresh_token: string = req.body.refresh_token;
    if (!refresh_token)
      throw new NonRetryableException(ApplicationStaticErrors.UNAUTHORIZED);
    const response = await service.refreshToken(refresh_token);
    res.json({
      data: response,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    logger.error("Error inside Refresh Token controller");
    next(error);
  }
}
