import { TEAM_TYPE } from "../../common/enum";

export interface TeamRequest {
  institute_id: string;
  team_type: TEAM_TYPE;
}
