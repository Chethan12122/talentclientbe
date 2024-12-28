import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { NonRetryableException } from "../errors/base.error";
import {
  ApplicationDynamicErrors,
  ApplicationStaticErrors,
} from "../errors/application.error";
import { isValidPhoneNumber } from "../validator/common.validator";

const userRegisterRequestSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  phone_number: z.string().refine((data) => isValidPhoneNumber(data), {
    message: "Invalid phone number",
  }),
  password: z
    .string()
    .min(1)
    .refine((data) => data.length >= 8, {
      message: "Password must be at least 8 characters long",
    }),
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
    console.log(error);
    throw new NonRetryableException(
      ApplicationStaticErrors.INVALID_REGISTER_REQUEST
    );
  }
}

export { validateUserRegisterRequest };
