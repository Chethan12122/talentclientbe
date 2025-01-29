import { AthleteInformation } from "./user.interface";

export const columnMapping: Record<string, keyof AthleteInformation> = {
  "Phone Number": "phone_number",
  Date: "date",
  Name: "name",
  Age: "age",
  Height: "height",
  Weight: "weight",
  Sport: "sport",
  "Vertical Jump Trial 1": "vertical_jump_trial1",
  "Vertical Jump Trial 2": "vertical_jump_trial2",
  "Vertical Jump Trial 3": "vertical_jump_trial3",
  "Best of 3 in Vertical Jump": "best_of_3_in_vertical_jump",
  "Squat Jump Trial 1": "squat_jump_trial1",
  "Squat Jump Trial 2": "squat_jump_trial2",
  "Squat Jump Trial 3": "squat_jump_trial3",
  "Best of 3 in Squat Jump": "best_of_3_in_squat_jump",
  "Iso belt Squat Trial 1": "iso_belt_squat_trial1",
  "Iso belt Squat Trial 2": "iso_belt_squat_trial2",
  "Iso belt Squat Trial 3": "iso_belt_squat_trial3",
  "Best of 3 in Iso belt Squat": "best_of_3_in_iso_belt_squat",
  "Agility test Trial 1": "agility_test_trial1",
  "Agility test Trial 2": "agility_test_trial2",
  "Agility test Trial 3": "agility_test_trial3",
  "Best of 3 in Agility test": "best_of_3_in_agility_test",
  "10 m Speed Trial 1": "ten_meter_speed_trial1",
  "10 m Speed Trial 2": "ten_meter_speed_trial2",
  "10 m Speed Trial 3": "ten_meter_speed_trial3",
  "Best of 3 in 10 m Speed": "best_of_3_in_ten_meter_speed",
  "MB Throw Trial 1": "mb_throw_trial1",
  "MB Throw Trial 2": "mb_throw_trial2",
  "MB Throw Trial 3": "mb_throw_trial3",
  "Best of 3 in MB Throw": "best_of_3_in_mb_throw",
};

function mapRowToAthlete(row: Record<string, string>): AthleteInformation {
  const athlete: Partial<AthleteInformation> = {};

  for (const [header, field] of Object.entries(columnMapping)) {
    const value = row[header];

    athlete[field] = value as any;
  }

  return athlete as AthleteInformation;
}

export { mapRowToAthlete };
