import { Role } from "../../common/enum";
import { supabase } from "../../common/supabase";
import { ApplicationDynamicErrors } from "../../errors/application.error";
import { NonRetryableException } from "../../errors/base.error";
import { AthleteInformation } from "../../models/user/user.interface";

async function getAllUsers() {
  const { data, error } = await supabase.from("users").select("*");

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

async function getUserById(id: string, type: string) {
  const { data, error } = await supabase.from("users").select("*").eq(type, id);

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

async function getAllReferres() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", Role.Referee);

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

async function addAthleteData(data: AthleteInformation[]) {
  const { error } = await supabase.from("users_information").insert(data);
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

async function deleteALLAthleteData() {
  const { error } = await supabase
    .from("users_information")
    .delete()
    .neq("phone_number", "*");
  if (error) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.SDK_API_ERROR(
        error.message,
        500,
        error.code || ""
      )
    );
  }
}

async function getUserExtraInformation(phone_number: string) {
  const { data, error } = await supabase
    .from("users_information")
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

  return data;
}

export default {
  getAllUsers,
  getUserById,
  getAllReferres,
  addAthleteData,
  deleteALLAthleteData,
  getUserExtraInformation,
};
