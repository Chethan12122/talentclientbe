import supabaseUserSdk from "../../sdk/user/supabase.user.sdk";

async function getAllUsers() {
  const response = await supabaseUserSdk.getAllUsers();
  return response;
}

async function getUserById(id: string, type: string) {
  const response = await supabaseUserSdk.getUserById(id, type);
  return response;
}

async function getAllUsersAssociatedWithGameCategoryAndGender(
  game_category_id: string
) {
  const allUsers = await supabaseUserSdk.getAllUsers();
  const usersAssociatedWithGameCategory = allUsers.filter((user) => {
    if (!user.game_categories) return false;
    return user.game_categories.includes(game_category_id);
  });

  return usersAssociatedWithGameCategory || [];
}

// async function updateUser(user_id: string, requestBody: any) {
//   const response = await supabaseUserSdk.updateUser(user_id, requestBody);
//   return response;
// }

export default {
  getAllUsers,
  getUserById,
  getAllUsersAssociatedWithGameCategoryAndGender,
};
