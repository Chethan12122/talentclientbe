/* eslint-disable require-await */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-return-await */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FIXTURE_STATUS, TEAM_TYPE } from "../../common/enum";
import {
  Athlete,
  FixtureRequest,
  Institute,
  ParticipantRequest,
  ScheduledFixture,
  Team,
  User,
} from "../../models/fixtures/fixtures.interface";
import gameSupabase from "../../sdk/game/supabase.game.sdk";
import supabaseTeamSdk from "../../sdk/team/supabase.team.sdk";
import userService from "../user/user.service";
import seasonService from "../season/season.service";
import instituteService from "../institute/institute.service";
import teamService from "../team/team.service";
import gameService from "../game/game.service";
import fixturesSupabase from "../../sdk/fixtures/supabase.fixtures.sdk";
import { TeamResponse } from "../../models/team/team.interface";
import { console } from "inspector";
import {
  InstituteResponse,
} from "../../models/institute/institute.interface";
import {
  GameCategoryResponse,
} from "../../models/game/game.interface";

async function generateFixtures(game_category_id: string, season_id: string) {
  const gameCategoryInfo =
    await gameSupabase.getGameCategoryById(game_category_id);
  if (!gameCategoryInfo) {
    throw new Error(`Game category with ID ${game_category_id} not found.`);
  }

  const usersAssociated =
    await userService.getAllUsersAssociatedWithGameCategoryAndGender(
      game_category_id
    );

  const usersWithTeamType = await mapUsersToTeamType(usersAssociated);
  const institutes = transformToInstituteStructure(usersWithTeamType);
  const instituteMap = convertToInstituteMap(institutes);

  const seasonInfo = await seasonService.getSeasonById(season_id);
  const scheduledFixtures = createInstituteFixtures(institutes, seasonInfo);

  await createFixturesAndParticipants(
    scheduledFixtures,
    game_category_id,
    season_id,
    instituteMap
  );

  return scheduledFixtures;
}

function convertToInstituteMap(institutes: Institute[]): Map<string, Team[]> {
  return institutes.reduce((map, institute) => {
    map.set(institute.institute_id, institute.teams);
    return map;
  }, new Map<string, Team[]>());
}

async function createFixturesAndParticipants(
  scheduledFixtures: ScheduledFixture[],
  game_category_id: string,
  season_id: string,
  instituteMap: Map<string, Team[]>
) {
  for (const fixture of scheduledFixtures) {
    const { fixture_date, competing_institutes, venue } = fixture;
    const { home_institute, away_institute } = competing_institutes;

    for (const team_type of Object.values(TEAM_TYPE)) {
      const fixtureRequest: FixtureRequest = {
        fixture_date,
        category_id: game_category_id,
        season_id,
        venue,
        status: FIXTURE_STATUS.UPCOMING,
      };

      const fixtureCreateResponse = await createFixtures(fixtureRequest);

      const participants = [
        ...getParticipantsForInstitute(home_institute, team_type, instituteMap),
        ...getParticipantsForInstitute(away_institute, team_type, instituteMap),
      ];

      await Promise.all(
        participants.map((participant) =>
          createParticipant({
            fixture_id: fixtureCreateResponse.fixture_id,
            team_id: participant.team_id,
            user_id: participant.user_id,
          })
        )
      );
    }
  }
}

function getParticipantsForInstitute(
  institute_id: string,
  team_type: string,
  instituteMap: Map<string, Team[]>
): Athlete[] {
  const team = instituteMap
    .get(institute_id)
    ?.find((t) => t.team_type === team_type);
  return team?.athletes || [];
}

async function mapUsersToTeamType(users: User[]): Promise<User[]> {
  return Promise.all(
    users.map(async (user) => {
      const team = await supabaseTeamSdk.getTeamById(user.team_id);
      if (!team) {
        throw new Error(`Team with ID ${user.team_id} not found.`);
      }
      return { ...user, team_type: team.team_type };
    })
  );
}

function transformToInstituteStructure(users: User[]): Institute[] {
  const instituteMap: Record<
    string,
    Record<string, { team_type: string; athletes: Athlete[] }>
  > = {};

  users.forEach((user) => {
    if (!instituteMap[user.institute_id]) {
      instituteMap[user.institute_id] = {};
    }
    if (!instituteMap[user.institute_id][user.team_id]) {
      instituteMap[user.institute_id][user.team_id] = {
        team_type: user.team_type,
        athletes: [],
      };
    }
    instituteMap[user.institute_id][user.team_id].athletes.push(user);
  });

  return Object.entries(instituteMap).map(([institute_id, teams]) => ({
    institute_id,
    teams: Object.entries(teams).map(([team_id, teamData]) => ({
      team_id,
      team_type: teamData.team_type,
      athletes: teamData.athletes,
    })),
  }));
}

function generateInstituteFixtures(
  institutes: Institute[]
): [string, string][][] {
  const fixtures: [string, string][][] = [];
  const rotatedInstitutes = [...institutes];

  if (rotatedInstitutes.length % 2 !== 0) {
    rotatedInstitutes.push({ institute_id: "BYE", teams: [] });
  }

  const totalRounds = rotatedInstitutes.length - 1;
  const halfSize = rotatedInstitutes.length / 2;

  for (let round = 0; round < totalRounds; round++) {
    const roundFixtures: [string, string][] = [];

    for (let i = 0; i < halfSize; i++) {
      const home = rotatedInstitutes[i].institute_id;
      const away =
        rotatedInstitutes[rotatedInstitutes.length - 1 - i].institute_id;

      if (home !== "BYE" && away !== "BYE") {
        roundFixtures.push([home, away]);
      }
    }

    fixtures.push(roundFixtures);

    const last = rotatedInstitutes.pop()!;
    rotatedInstitutes.splice(1, 0, last);
  }

  return fixtures;
}

function scheduleInstituteFixturesWithVenue(
  fixtures: [string, string][][],
  seasonDetails: any
): ScheduledFixture[] {
  const scheduledFixtures: ScheduledFixture[] = [];
  let currentDate = new Date(seasonDetails.start_date); // Use `let` for modifiable variable
  const breakStart = new Date(seasonDetails.break_start_date);
  const breakEnd = new Date(seasonDetails.break_end_date);

  const allInstitutes = fixtures
    .flat()
    .map(([home, away]) => [home, away])
    .flat()
    .filter(
      (institute, index, self) =>
        institute !== "BYE" && self.indexOf(institute) === index
    ); // Unique non-BYE institutes

  fixtures.forEach((roundFixtures) => {
    // Skip dates during the break period
    while (currentDate >= breakStart && currentDate <= breakEnd) {
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 7)); // Explicitly update `currentDate`
    }

    roundFixtures.forEach(([home, away]) => {
      // Find all eligible venues (excluding home and away institutes)
      const availableVenues = allInstitutes.filter(
        (institute) => institute !== home && institute !== away
      );

      // Rotate through available venues to maintain fairness
      const venueIndex = scheduledFixtures.length % availableVenues.length;
      const venue = availableVenues[venueIndex];

      scheduledFixtures.push({
        fixture_date: currentDate.toISOString().split("T")[0],
        competing_institutes: {
          home_institute: home,
          away_institute: away,
        },
        venue, // Properly assigned venue
      });
    });

    // Move to the next fixture date (7 days later)
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 7)); // Explicitly update `currentDate`
  });

  return scheduledFixtures;
}

function createInstituteFixtures(
  institutes: Institute[],
  seasonDetails: any
): ScheduledFixture[] {
  const fixtures = generateInstituteFixtures(institutes);
  return scheduleInstituteFixturesWithVenue(fixtures, seasonDetails);
}

async function createFixtures(fixtureRequest: FixtureRequest) {
  return await fixturesSupabase.createFixtures(fixtureRequest);
}

async function createParticipant(participantRequest: ParticipantRequest) {
  return await fixturesSupabase.createParticipant(participantRequest);
}

function convertTeamsToTeamMap(teams: TeamResponse[]) {
  //create a map of <team_id, team>
  const teamMap = new Map<string, TeamResponse>();
  teams.forEach((team) => teamMap.set(team.team_id, team));
  return teamMap;
}

function convertToInstituteDetailsMap(institutes: InstituteResponse[]) {
  return institutes.reduce((map, institute) => {
    map.set(institute.institute_id, institute);
    return map;
  }, new Map<string, InstituteResponse>());
}

function convertGameCategoryToMap(gameCategories: GameCategoryResponse[]) {
  return gameCategories.reduce((map, gameCategory) => {
    map.set(gameCategory.category_id, gameCategory);
    return map;
  }, new Map<string, GameCategoryResponse>());
}

function modifyFixtureResponse(
  fixturesWithParticipants: any[],
  teamMap: Map<string, TeamResponse>,
  instituteMap: Map<string, InstituteResponse>,
  gameCategoryMap: Map<string, GameCategoryResponse>
) {
  fixturesWithParticipants.forEach((fixture: { participants: any[] , venue: string, category_id: string, category_details: any, venue_details: any}) => {
    const participants = fixture.participants || [];

    participants.forEach(
      (participant: { team_id: string; team_details: TeamResponse }) => {
        const teamId = participant.team_id;

        if (teamMap.has(teamId)) {
          participant.team_details = teamMap.get(teamId) as TeamResponse;
        }
      }
    );

    fixture.participants = participants;

    const venue_id = fixture.venue;

    if (instituteMap.has(venue_id)) {
      fixture.venue_details = instituteMap.get(venue_id) as InstituteResponse;
    }

    const category_id = fixture.category_id;

    if (gameCategoryMap.has(category_id)) {
      fixture.category_details = gameCategoryMap.get(
        category_id
      ) as GameCategoryResponse;
    }

  });

  return fixturesWithParticipants;
}

async function getFixturesForCategoryAndSeason(
  game_category_id: string,
  season_id: string
) {

  //get all teams
  const allTeams = await teamService.getAllTeams("");

  const teamMap: Map<string, TeamResponse> = convertTeamsToTeamMap(allTeams);

  //get all institutes
  const allInstitutes = await instituteService.getAllInstitutes();

  const instituteMap: Map<string, InstituteResponse> =
    convertToInstituteDetailsMap(allInstitutes);

  //get all game_categories
  const game_categories = await gameService.getAllGameCategories("");

  const gameCategoryMap: Map<string, GameCategoryResponse> =
    convertGameCategoryToMap(game_categories);

  // Get fixtures for category
  const fixturesAssociatedWithCategory =
    await fixturesSupabase.getFixturesForCategory(game_category_id, season_id);

  // Fetch the participants for each fixture
  let fixturesWithParticipants = await Promise.all(
    fixturesAssociatedWithCategory.map(async (fixture) => {
      const participants = await fixturesSupabase.getParticipantsForFixture(
        fixture.fixture_id
      );
      return {
        ...fixture,
        participants,
      };
    })
  );

  fixturesWithParticipants = modifyFixtureResponse(
    fixturesWithParticipants,
    teamMap,
    instituteMap,
    gameCategoryMap
  );

  return fixturesWithParticipants;
}

export default { generateFixtures, getFixturesForCategoryAndSeason };
