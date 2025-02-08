/* eslint-disable @typescript-eslint/no-explicit-any*/
/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { NonRetryableException } from "../errors/base.error";
import { ApplicationStaticErrors } from "../errors/application.error";
import { isValidPhoneNumber } from "../validator/common.validator";
import { Role, SOURCE } from "../common/enum";

const userRegisterRequestSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  phone_number: z.string().refine((data) => isValidPhoneNumber(data), {
    message: "Invalid phone number",
  }),
  email: z.string().email(),
  password: z
    .string()
    .min(1)
    .refine((data) => data.length >= 8, {
      message: "Password must be at least 8 characters long",
    }),
  role: z.enum(Object.values(Role) as [string, ...string[]]),
});

const userVerifyRequestSchema = z.object({
  phone_number: z.string().refine((data) => isValidPhoneNumber(data), {
    message: "Invalid phone number",
  }),
  code: z.string().min(6).max(6),
});

const userLoginRequestSchema = z.object({
  // phone_number: z.string().refine((data) => isValidPhoneNumber(data), {
  //   message: "Invalid phone number",
  // }),
  email: z.string().email(),
  password: z.string().min(1),
  source: z.enum(Object.values(SOURCE) as [string, ...string[]]),
});

function validateUserRegisterRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    userRegisterRequestSchema.parse(req.body);
    next();
  } catch (error: any) {
    throw new NonRetryableException(
      ApplicationStaticErrors.INVALID_REGISTER_REQUEST
    );
  }
}

function validateUserVerifyRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    userVerifyRequestSchema.parse(req.body);
    next();
  } catch (error: any) {
    throw new NonRetryableException(
      ApplicationStaticErrors.INVALID_VERIFY_REQUEST
    );
  }
}

function validateUserLoginRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    userLoginRequestSchema.parse(req.body);
    next();
  } catch (error: any) {
    throw new NonRetryableException(
      ApplicationStaticErrors.INVALID_LOGIN_REQUEST
    );
  }
}

export {
  validateUserRegisterRequest,
  validateUserVerifyRequest,
  validateUserLoginRequest,
};
