import { FIXTURE_STATUS, TEAM_TYPE } from "../../common/enum";

export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: string;
  profile_image_url: string;
  matches_officiated: number;
  created_at: string;
  updated_at: string;
  institute_id: string;
  game_categories: string[];
  team_id: string;
  team_type: string;
}

export interface Athlete {
  user_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: string;
  profile_image_url: string;
  matches_officiated: number;
  created_at: string;
  updated_at: string;
  game_categories: string[];
  team_type: string;
}

export interface Team {
  team_id: string;
  team_type: string;
  athletes: Athlete[]; // List of athletes for each team
}

export interface Institute {
  institute_id: string;
  teams: Team[]; // Each institute has teams, each containing athletes
}

export interface Match {
  team1: {
    team_id: string; // team_id as a string
    athletes: Athlete[]; // List of athletes for team1
  };
  team2: {
    team_id: string; // team_id as a string
    athletes: Athlete[]; // List of athletes for team2
  };
  team_type: TEAM_TYPE; // Type of team (e.g., HIGH_PERFORMANCE, DEVELOPMENT)
}

export interface Fixture {
  institute1: string;
  institute2: string;
  venue: string;
  matches: Match[]; // Array of matches between teams
}

export interface FixtureRequest {
  category_id: string; // Category of the fixture
  season_id: string; // Season of the fixture
  venue: string; // Venue of the fixture
  status: FIXTURE_STATUS; // Current status of the fixture
}

export interface ParticipantRequest {
  user_id: string; // User ID
  fixture_id: string; // Fixture ID
  team_id: string; // Team ID
}
