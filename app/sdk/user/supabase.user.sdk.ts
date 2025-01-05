import { supabase } from "../../common/supabase";
import { ApplicationDynamicErrors } from "../../errors/application.error";
import { NonRetryableException } from "../../errors/base.error";

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

// async function updateUser(user_id: string, requestBody: any) {
//   const { data, error } = await supabase
//     .from("users")
//     .update(requestBody)
//     .eq("user_id", user_id)
//     .single();

//   if (error) {
//     throw new NonRetryableException(
//       ApplicationDynamicErrors.SDK_API_ERROR(
//         error.message,
//         500,
//         error.code || ""
//       )
//     );
//   }

//   return data;
// }

export default { getAllUsers, getUserById };
