import { LEAGUE_STATUS } from "../../common/enum";

export interface LeagueRequest {
  name: string;
  description: string;
  status: LEAGUE_STATUS;
  start_date: Date;
  end_date: Date;
  district_id: string;
}

export interface LeagueGroupMappingResponse {
  group: string;
  league_id: string;
  id: string;
}