/* eslint-disable require-await */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-return-await */
import { FIXTURE_STATUS, TEAM_TYPE } from "../../common/enum";
import {
  Athlete,
  Fixture,
  FixtureRequest,
  Institute,
  Match,
  ParticipantRequest,
  User,
} from "../../models/fixtures/fixtures.interface";
import gameSupabase from "../../sdk/game/supabase.game.sdk";
import supabaseTeamSdk from "../../sdk/team/supabase.team.sdk";
import userService from "../user/user.service";
import fixturesSupabase from "../../sdk/fixtures/supabase.fixtures.sdk";

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
  
  const fixtures = createFixtureList(institutes);
  
  await saveFixturesAndParticipants(fixtures, game_category_id, season_id);

  return fixtures;
}

async function mapUsersToTeamType(users: User[]): Promise<User[]> {
  // Await the resolution of all promises in the map function
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

function createFixtureList(institutes: Institute[]): Fixture[] {
  const fixtures: Fixture[] = [];

  for (let i = 0; i < institutes.length; i++) {
    for (let j = i + 1; j < institutes.length; j++) {
      const institute1 = institutes[i];
      const institute2 = institutes[j];

      const venue = selectVenue(institutes, institute1, institute2);

      const matches = generateMatches(institute1, institute2);
      if (matches.length > 0) {
        fixtures.push({
          institute1: institute1.institute_id,
          institute2: institute2.institute_id,
          venue,
          matches,
        });
      }
    }
  }

  return fixtures;
}

function selectVenue(
  institutes: Institute[],
  inst1: Institute,
  inst2: Institute
): string {
  if (institutes.length > 2) {
    const otherInstitute = institutes.find(
      (inst) =>
        inst.institute_id !== inst1.institute_id &&
        inst.institute_id !== inst2.institute_id
    );
    return otherInstitute?.institute_id || inst1.institute_id;
  }
  return Math.random() > 0.5 ? inst1.institute_id : inst2.institute_id;
}

function generateMatches(inst1: Institute, inst2: Institute): Match[] {
  const matches: Match[] = [];

  inst1.teams.forEach((team1) => {
    inst2.teams.forEach((team2) => {
      if (team1.team_type === team2.team_type) {
        matches.push({
          team1: { team_id: team1.team_id, athletes: team1.athletes },
          team2: { team_id: team2.team_id, athletes: team2.athletes },
          team_type: team1.team_type as TEAM_TYPE,
        });
      }
    });
  });

  return matches;
}

async function saveFixturesAndParticipants(
  fixtures: Fixture[],
  game_category_id: string,
  season_id: string
) {
  const convertedFixtures = fixtures
    .map((fixture) => {
      const { institute1, institute2, venue, matches } = fixture;

      return matches.map((match) => {
        const team1 =
          match.team_type === "HIGH_PERFORMANCE" ? match.team1 : null;
        const team2 =
          match.team_type === "HIGH_PERFORMANCE" ? match.team2 : null;

        return {
          institute1,
          institute2,
          venue,
          match: {
            team1: team1 ?? match.team1,
            team2: team2 ?? match.team2,
            team_type: match.team_type,
          },
        };
      });
    })
    .flat();
  for (const fixture of convertedFixtures) {
    const fixtureRequest: FixtureRequest = {
      category_id: game_category_id,
      season_id,
      venue: fixture.venue,
      status: FIXTURE_STATUS.UPCOMING,
    };

    const fixtureResponse = await createFixtures(fixtureRequest);
    const fixtureId = fixtureResponse?.fixture_id;

    if (!fixtureId) {
      continue;
    }

    const participantRequests = generateParticipantRequests(
      fixture.match,
      fixtureId
    );
    for (const participantRequest of participantRequests) {
      await createParticipant(participantRequest);
    }
  }
}

function generateParticipantRequests(
  match: Match,
  fixtureId: string
): ParticipantRequest[] {
  const participantRequests: ParticipantRequest[] = [];

  // Add participants from team1
  match.team1.athletes.forEach((athlete) => {
    participantRequests.push({
      user_id: athlete.user_id,
      fixture_id: fixtureId,
      team_id: match.team1.team_id,
    });
  });

  // Add participants from team2
  match.team2.athletes.forEach((athlete) => {
    participantRequests.push({
      user_id: athlete.user_id,
      fixture_id: fixtureId,
      team_id: match.team2.team_id, // Corrected here
    });
  });

  return participantRequests;
}

async function createFixtures(fixtureRequest: FixtureRequest) {
  return await fixturesSupabase.createFixtures(fixtureRequest);
}

async function createParticipant(participantRequest: ParticipantRequest) {
  return await fixturesSupabase.createParticipant(participantRequest);
}

async function getFixturesForCategory(game_category_id: string) {
  // Get fixtures for category
  const fixturesAssociatedWithCategory =
    await fixturesSupabase.getFixturesForCategory(game_category_id);

  // Fetch the participants for each fixture
  const fixturesWithParticipants = await Promise.all(
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

  return fixturesWithParticipants;
}

export default { generateFixtures, getFixturesForCategory };
