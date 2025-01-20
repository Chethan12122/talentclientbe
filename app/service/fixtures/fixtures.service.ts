/* eslint-disable require-await */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-return-await */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FIXTURE_STATUS, TEAM_TYPE } from "../../common/enum";
import {
  Athlete,
  FixtureManualCreationRequest,
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
  VenueInstituteResponse,
  VenueResponse,
} from "../../models/institute/institute.interface";
import { GameCategoryResponse } from "../../models/game/game.interface";
import { NonRetryableException } from "../../errors/base.error";
import { ApplicationStaticErrors } from "../../errors/application.error";

async function generateFixturesForGame(game_id: string, season_id: string) {
  const gameCategories = await gameSupabase.getAllGameCategories(game_id);
  let response: any[] = []; // Initialize the response array
  for (const gameCategory of gameCategories) {
    const fixtures = await generateFixtures(
      gameCategory.category_id,
      season_id
    );
    response = response.concat(fixtures);
  }
  return response;
}

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

  if (usersAssociated.length === 0) {
    return [];
  }
  const usersWithTeamType = await mapUsersToTeamType(usersAssociated);
  const institutes = transformToInstituteStructure(usersWithTeamType);
  const instituteMap = convertToInstituteMap(institutes);

  const seasonInfo = await seasonService.getSeasonById(season_id);
  const venues: VenueInstituteResponse[] =
    await instituteService.getAllVenuesByInstituteIds();
  const scheduledFixtures = createInstituteFixtures(
    institutes,
    seasonInfo,
    venues
  );

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
  seasonDetails: any,
  venues: VenueInstituteResponse[]
): ScheduledFixture[] {
  const scheduledFixtures: ScheduledFixture[] = [];
  let currentDate = new Date(seasonDetails.start_date); // Use `let` for modifiable variable
  const breakStart = new Date(seasonDetails.break_start_date);
  const breakEnd = new Date(seasonDetails.break_end_date);

  fixtures.forEach((roundFixtures) => {
    // Skip dates during the break period
    while (currentDate >= breakStart && currentDate <= breakEnd) {
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 7)); // Explicitly update `currentDate`
    }

    roundFixtures.forEach(([home, away]) => {
      const eligibleVenues = venues.filter(
        (venue) => venue.institute_id !== home && venue.institute_id !== away
      );

      if (eligibleVenues.length === 0) {
        throw new Error("No eligible venues available for fixture scheduling.");
      }

      // Select a venue in a round-robin fashion to maintain fairness
      const venueIndex = scheduledFixtures.length % eligibleVenues.length;
      const selectedVenue = eligibleVenues[venueIndex].venue_id;

      scheduledFixtures.push({
        fixture_date: currentDate.toISOString().split("T")[0],
        competing_institutes: {
          home_institute: home,
          away_institute: away,
        },
        venue: selectedVenue, // Properly assigned venue
      });
    });

    // Move to the next fixture date (7 days later)
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 7)); // Explicitly update `currentDate`
  });

  return scheduledFixtures;
}

function createInstituteFixtures(
  institutes: Institute[],
  seasonDetails: any,
  venues: VenueInstituteResponse[]
): ScheduledFixture[] {
  const fixtures = generateInstituteFixtures(institutes);
  return scheduleInstituteFixturesWithVenue(fixtures, seasonDetails, venues);
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

function convertGameCategoryToMap(gameCategories: GameCategoryResponse[]) {
  return gameCategories.reduce((map, gameCategory) => {
    map.set(gameCategory.category_id, gameCategory);
    return map;
  }, new Map<string, GameCategoryResponse>());
}

function modifyFixtureResponse(
  fixturesWithParticipants: any[],
  teamMap: Map<string, TeamResponse>,
  venueMap: Map<string, VenueResponse>,
  gameCategoryMap: Map<string, GameCategoryResponse>
) {
  fixturesWithParticipants.forEach(
    (fixture: {
      participants: any[];
      venue: string;
      category_id: string;
      category_details: any;
      venue_details: any;
    }) => {
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

      if (venueMap.has(venue_id)) {
        fixture.venue_details = venueMap.get(venue_id) as VenueResponse;
      }

      const category_id = fixture.category_id;

      if (gameCategoryMap.has(category_id)) {
        fixture.category_details = gameCategoryMap.get(
          category_id
        ) as GameCategoryResponse;
      }
    }
  );

  return fixturesWithParticipants;
}

function convertToVenueMap(venues: VenueResponse[]) {
  return venues.reduce((map, venue) => {
    map.set(venue.id, venue);
    return map;
  }, new Map<string, VenueResponse>());
}

async function getFixturesForCategoryAndSeason(
  game_category_id: string,
  season_id: string
) {
  //get all teams
  const allTeams = await teamService.getAllTeams("");

  const teamMap: Map<string, TeamResponse> = convertTeamsToTeamMap(allTeams);


  //venue
  const venues: VenueResponse[] = await instituteService.getAllVenues();
  const venueMap: Map<string, VenueResponse> = convertToVenueMap(venues);

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
    venueMap,
    gameCategoryMap
  );

  return fixturesWithParticipants;
}

async function getFixturesForGame(game_id: string, season_id: string) {
  const gameCategories = await gameSupabase.getAllGameCategories(game_id);
  let response: any[] = [];

  for (const gameCategory of gameCategories) {
    const fixtures = await getFixturesForCategoryAndSeason(
      gameCategory.category_id,
      season_id
    );
    response = response.concat(fixtures);
  }

  //sort it with fixture_date

  response.sort((a: any, b: any) => {
    return (
      new Date(a.fixture_date).getTime() - new Date(b.fixture_date).getTime()
    );
  });

  return response;
}

async function manualFixtureCreation(
  fixtureRequest: FixtureManualCreationRequest
) {
  const { teams, ...requestPayload } = fixtureRequest;
  const fixtureCreateResponse =
    await fixturesSupabase.createFixtures(requestPayload);
  console.log("fixture", JSON.stringify(fixtureCreateResponse, null, 2));

  const teamUserMap: Map<string, User[]> = new Map<string, User[]>();

  // Populate teamUserMap
  for (const team_id of teams) {
    const usersAssociatedWithTeam: User[] =
      await userService.getAllUsersAssociatedWithTeamAndGameCategory(
        team_id,
        requestPayload.category_id
      );
    teamUserMap.set(team_id, usersAssociatedWithTeam);
  }

  // Traverse the map and create participants
  for (const [team_id, users] of teamUserMap) {
    for (const user of users) {
      const participantRequest: ParticipantRequest = {
        fixture_id: fixtureCreateResponse.fixture_id,
        team_id: user.team_id,
        user_id: user.user_id,
      };

      await createParticipant(participantRequest);
    }
  }

  return "success";
}

async function updateFixture(
  fixture_id: string,
  fixtureRequest: FixtureManualCreationRequest
) {
  const { teams, ...requestPayload } = fixtureRequest;

  const existingFixture = await fixturesSupabase.getFixtureById(fixture_id);

  const existingTeams =
    await fixturesSupabase.getParticipantsForFixture(fixture_id);

  if (!existingFixture) {
    throw new NonRetryableException(
      ApplicationStaticErrors.INVALID_MANUAL_FIXTURE_REQUEST
    );
  }

  const response = await fixturesSupabase.updateFixture(
    fixture_id,
    requestPayload
  );

  //check if existing teams contents are same as teams in request

  const existingTeamsArray = existingTeams.map((team) => team.team_id);

  if (
    (existingTeamsArray.length === teams.length &&
      existingTeamsArray.every((team_id) => teams.includes(team_id))) ||
    teams.length === 0
  ) {
    return;
  }

  //delete existing participants
  await fixturesSupabase.deleteParticipantsForFixture(fixture_id);

  //create new participants

  const teamUserMap: Map<string, User[]> = new Map<string, User[]>();

  // Populate teamUserMap
  for (const team_id of teams) {
    const usersAssociatedWithTeam: User[] =
      await userService.getAllUsersAssociatedWithTeamAndGameCategory(
        team_id,
        requestPayload.category_id
      );
    teamUserMap.set(team_id, usersAssociatedWithTeam);
  }

  // Traverse the map and create participants
  for (const [team_id, users] of teamUserMap) {
    for (const user of users) {
      const participantRequest: ParticipantRequest = {
        fixture_id: fixture_id,
        team_id: user.team_id,
        user_id: user.user_id,
      };

      await createParticipant(participantRequest);
    }
  }
}

export default {
  generateFixtures,
  getFixturesForCategoryAndSeason,
  generateFixturesForGame,
  getFixturesForGame,
  manualFixtureCreation,
  updateFixture,
};
