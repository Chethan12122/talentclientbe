import supabaseUserSdk from "../../sdk/user/supabase.user.sdk";
import instituteService from "../institute/institute.service";
import teamService from "../team/team.service";

async function getAllUsers() {
  const response = await supabaseUserSdk.getAllUsers();
  return response;
}

async function getUserById(id: string, type: string) {
  const getAllUserWithRolesArray = await supabaseUserSdk.getUserById(id, type);
  const response: any[] = await Promise.all(
    getAllUserWithRolesArray.map(async (user) => ({
      ...user,
      institute_details: user.institute_id
        ? await instituteService.getInstituteById(user.institute_id)
        : null,
      team_details: user.team_id
        ? await teamService.getTeamById(user.team_id)
        : null,
    }))
  );

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

async function getAllUsersAssociatedWithTeamAndGameCategory(
  team_id: string,
  game_category_id: string
) {
  const allUsers = await supabaseUserSdk.getAllUsers();
  const usersAssociatedWithTeamAndGameCategory = allUsers.filter((user) => {
    if (!user.game_categories) return false;
    return (
      user.game_categories.includes(game_category_id) &&
      user.team_id === team_id
    );
  });

  return usersAssociatedWithTeamAndGameCategory || [];
}

// async function updateUser(user_id: string, requestBody: any) {
//   const response = await supabaseUserSdk.updateUser(user_id, requestBody);
//   return response;
// }

export default {
  getAllUsers,
  getUserById,
  getAllUsersAssociatedWithGameCategoryAndGender,
  getAllUsersAssociatedWithTeamAndGameCategory,
};
