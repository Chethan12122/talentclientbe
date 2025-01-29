import { getGoogleSheetsClient } from "../../common/google-auth";
import supabaseUserSdk from "../../sdk/user/supabase.user.sdk";
import instituteService from "../institute/institute.service";
import teamService from "../team/team.service";
import { config } from "../../common/config";
import { NonRetryableException } from "../../errors/base.error";
import { ApplicationStaticErrors } from "../../errors/application.error";
import { AthleteInformation } from "../../models/user/user.interface";
import { mapRowToAthlete } from "../../models/user/user.helper";

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
      extra_user_details:
        type === "phone_number" || type === "user_id"
          ? await getUserExtraInformation(user.phone_number)
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

async function getAllReferres() {
  const response = await supabaseUserSdk.getAllReferres();
  return response;
}

async function refereshUserInfoFromExcel() {
  const sheets = getGoogleSheetsClient();
  const sheet_id = config.googleAuth.sheet_id || "";
  const sheet_name = config.googleAuth.sheet_name || "";

  if (!sheet_id || !sheet_name)
    throw new NonRetryableException(
      ApplicationStaticErrors.INVALID_GOOGLE_SHEET_ID
    );

  // Read data from Google Sheets
  const sheetData = await sheets.spreadsheets.values.get({
    spreadsheetId: sheet_id,
    range: sheet_name,
  });

  const rows: any[] = sheetData.data.values || [];

  if (rows.length < 2) {
    throw new NonRetryableException(
      ApplicationStaticErrors.NOT_ENOUGH_DATA_IN_GOOGLE_SHEET
    );
  }

  // Extract the remaining rows as data
  const dataRows = rows.slice(2);

  const headers = rows[1];

  const formattedData: AthleteInformation[] = dataRows.map((row) => {
    const rowObject: Record<string, string> = {};

    // Explicitly define header and index types
    headers.forEach((header: string, index: number) => {
      rowObject[header] = row[index]; // Map each header to its value
    });

    return mapRowToAthlete(rowObject); // Map to AthleteInformation
  });

  //clear existing data
  await supabaseUserSdk.deleteALLAthleteData();

  const response = await supabaseUserSdk.addAthleteData(formattedData);

  return response;
}

async function getUserExtraInformation(phone_number: string) {
  const response = await supabaseUserSdk.getUserExtraInformation(phone_number);
  return response;
}

async function addGameCategoryForUser(
  user_id: string,
  game_category_id: string,
  type: string
) {
  const user_details = await getUserById(user_id, "user_id");

  const gameCategoriesOfUser = user_details[0].game_categories || [];
  if (type.toLocaleUpperCase() !== "REMOVE") {
    if (gameCategoriesOfUser.includes(game_category_id)) {
      return;
    }

    const game_categories = [...gameCategoriesOfUser, game_category_id];

    await supabaseUserSdk.updateUserInfo(user_id, {
      game_categories: game_categories,
    });
  } else {
    if (!gameCategoriesOfUser.includes(game_category_id)) {
      throw new NonRetryableException(
        ApplicationStaticErrors.INVALID_GAME_CATEGORY
      );
    }

    //remove game_category_id
    const game_categories: string[] = gameCategoriesOfUser.filter(
      (game_category: string) => game_category !== game_category_id
    );

    await supabaseUserSdk.updateUserInfo(user_id, {
      game_categories: game_categories,
    });
  }
}

export default {
  getAllUsers,
  getUserById,
  getAllUsersAssociatedWithGameCategoryAndGender,
  getAllUsersAssociatedWithTeamAndGameCategory,
  getAllReferres,
  refereshUserInfoFromExcel,
  addGameCategoryForUser,
};
