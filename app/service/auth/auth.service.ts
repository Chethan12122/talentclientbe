/* eslint-disable @typescript-eslint/no-explicit-any */
import { Role, SOURCE } from "../../common/enum";
import { logger } from "../../common/logger";
import { ApplicationStaticErrors } from "../../errors/application.error";
import { NonRetryableException } from "../../errors/base.error";
import {
  LoginRequestBody,
  RegisterRequestBody,
  VerifyRequestBody,
} from "../../models/auth/auth.interface";
import supabaseSdk from "../../sdk/supabase.sdk";
import userService from "../user/user.service";

async function register(requestBody: RegisterRequestBody) {
  const existingUser = await supabaseSdk.getUserByPhoneNumber(
    requestBody.phone_number
  );
  logger.info("Existing user: " + JSON.stringify(existingUser));

  if (
    Array.isArray(existingUser) &&
    existingUser.length > 0 &&
    existingUser.some((user: any) => user.role === requestBody.role)
  ) {
    throw new NonRetryableException(
      ApplicationStaticErrors.USER_ALREADY_EXISTS
    );
  }

  logger.info("Signing up with phone number: " + requestBody.phone_number);

  const userSignUpSdkResponse = await supabaseSdk.signUpWithPhoneNumber(
    requestBody.phone_number,
    requestBody.password
  );

  logger.info(
    "User sign-up response: " + JSON.stringify(userSignUpSdkResponse)
  );

  if (!userSignUpSdkResponse?.user) {
    throw new NonRetryableException(
      ApplicationStaticErrors.SOMETHING_WENT_WRONG
    );
  }

  const response = await supabaseSdk.addUser(
    requestBody,
    userSignUpSdkResponse.user.id
  );
  return response;
}

async function verify(requestBody: VerifyRequestBody) {
  const response = await supabaseSdk.verifyPhoneNumber(
    requestBody.phone_number,
    requestBody.code
  );

  if (!response.user) {
    throw new NonRetryableException(
      ApplicationStaticErrors.SOMETHING_WENT_WRONG
    );
  }

  const user_details = await userService.getUserById(
    response.user.id,
    "user_id"
  );
  return { ...response, user_details: user_details[0] };
}

async function logout(tokenObject: any) {
  const data: any = await supabaseSdk.validateToken(tokenObject);
  if (!data) {
    throw new NonRetryableException(ApplicationStaticErrors.UNAUTHORIZED);
  }
  await supabaseSdk.logoutUser();
}

async function checkValidUser(phone_number: string): Promise<boolean> {
  const usersWithPhoneNumber =
    await supabaseSdk.getUserByPhoneNumber(phone_number);

  if (usersWithPhoneNumber.length === 0) {
    throw new NonRetryableException(
      ApplicationStaticErrors.INVALID_USER_LOGIN_REQUEST
    );
  }

  for (const user of usersWithPhoneNumber) {
    if (user.role === Role.Admin || user.role === Role.SuperAdmin) {
      return true;
    }
  }

  return false;
}

async function login(requestBody: LoginRequestBody) {
  const validUser =
    requestBody.source === SOURCE.ADMIN
      ? await checkValidUser(requestBody.phone_number)
      : true;
  if (!validUser) {
    throw new NonRetryableException(
      ApplicationStaticErrors.INVALID_USER_LOGIN_REQUEST
    );
  }

  const response = await supabaseSdk.loginWithPhoneNumber(
    requestBody.phone_number
  );

  const user_details = await userService.getUserById(
    response.user.id,
    "user_id"
  );

  return {
    ...response,
    user_details: user_details,
  };
}

async function verifyToken(access_token: string) {
  const response = await supabaseSdk.verifyToken(access_token);
  return response;
}

async function refreshToken(refresh_token: string) {
  const response = await supabaseSdk.refreshToken(refresh_token);
  return response;
}

export default { register, verify, logout, verifyToken, login, refreshToken };
