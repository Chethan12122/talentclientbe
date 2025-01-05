import supabaseUserSdk from "../../sdk/user/supabase.user.sdk";

async function getAllUsers() {
  const response = await supabaseUserSdk.getAllUsers();
  return response;
}

async function getUserById(user_id: string) {
  const response = await supabaseUserSdk.getUserById(user_id);
  return response;
}

// async function updateUser(user_id: string, requestBody: any) {
//   const response = await supabaseUserSdk.updateUser(user_id, requestBody);
//   return response;
// }

export default { getAllUsers, getUserById };
