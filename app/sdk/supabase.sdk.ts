/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from "../common/logger";
import { supabase } from "../common/supabase";
import { ApplicationDynamicErrors } from "../errors/application.error";
import { NonRetryableException } from "../errors/base.error";
import { RegisterRequestBody } from "../models/auth/auth.interface";

async function signUpWithPhoneNumber(phone_number: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    phone: phone_number,
    password: password,
  });
  if (error) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.SDK_API_ERROR(
        error.message,
        error.status || 500,
        error.code || ""
      )
    );
  }

  return data;
}

async function addUser(registerBody: RegisterRequestBody, userId: string) {
  const { data, error } = await supabase.from("users").insert([
    {
      user_id: userId,
      first_name: registerBody.first_name,
      last_name: registerBody.last_name,
      phone_number: registerBody.phone_number,
      role: registerBody.role,
    },
  ]);

  if (error) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.SDK_API_ERROR(
        error.message,
        500,
        error.code || ""
      )
    );
  }

  return data;
}

async function verifyPhoneNumber(phone_number: string, code: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone: phone_number,
    token: code,
    type: "sms",
  });

  if (error) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.SDK_API_ERROR(
        error.name,
        error.status || 500,
        error.code || ""
      )
    );
  }

  return data;
}

async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.SDK_API_ERROR(
        error.name,
        error.status || 500,
        error.code || ""
      )
    );
  }
}

async function loginWithPhoneNumber(phone_number: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: phone_number,
  });

  if (error) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.SDK_API_ERROR(
        error.name,
        error.status || 500,
        error.code || ""
      )
    );
  }

  return data;
}

async function validateToken(tokenObject: any) {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.setSession({
      access_token: tokenObject.access_token,
      refresh_token: tokenObject.refresh_token,
    });
  if (sessionError) {
    logger.error(sessionError);
    throw sessionError;
  }
  return sessionData;
}

async function verifyToken(token: string) {
  const { data, error } = await supabase.auth.getUser(token);
  if (error) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.SDK_API_ERROR(
        error.name,
        error.status || 500,
        error.code || ""
      )
    );
  }
  return data;
}

async function getUserByPhoneNumberAndRole(phone_number: string, role: string) {
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("phone_number", phone_number)
    .eq("role", role);

  if (error) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.SDK_API_ERROR(
        error.message,
        500,
        error.code || ""
      )
    );
  }

  // Return the first user if found, or null otherwise
  return users && users.length > 0 ? users[0] : null;
}

async function getUserByPhoneNumber(phone_number: string) {
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("phone_number", phone_number);

  if (error) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.SDK_API_ERROR(
        error.message,
        500,
        error.code || ""
      )
    );
  }

  // Return the first user if found, or null otherwise
  return users;
}
export default {
  signUpWithPhoneNumber,
  verifyPhoneNumber,
  logoutUser,
  validateToken,
  verifyToken,
  loginWithPhoneNumber,
  addUser,
  getUserByPhoneNumberAndRole,
  getUserByPhoneNumber,
};
