import supabaseUserSdk from "../../sdk/user/supabase.user.sdk";

async function getAllUsers() {
  const response = await supabaseUserSdk.getAllUsers();
  return response;
}

async function getUserById(id: string, type: string) {
  const response = await supabaseUserSdk.getUserById(id, type);
  return response;
}

// async function updateUser(user_id: string, requestBody: any) {
//   const response = await supabaseUserSdk.updateUser(user_id, requestBody);
//   return response;
// }

export default { getAllUsers, getUserById };
