import { TEAM_TYPE } from "../../common/enum";

export interface TeamRequest {
  team_name: string;
  institute_name: string;
  team_type: TEAM_TYPE;
  team_venue: string;
}
