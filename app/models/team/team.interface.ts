import { TEAM_TYPE } from "../../common/enum";

export interface TeamRequest {
  institute_id: string;
  team_type: TEAM_TYPE;
  season_id?: string;
}

export interface TeamResponse {
  team_id: string;
  team_type: TEAM_TYPE;
  institute_id: string;
  instituteDetails: any;
}
