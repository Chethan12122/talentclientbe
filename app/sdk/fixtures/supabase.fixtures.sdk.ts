import { supabase } from "../../common/supabase";
import { ApplicationDynamicErrors } from "../../errors/application.error";
import { NonRetryableException } from "../../errors/base.error";
import {
  FixtureRequest,
  ParticipantRequest,
} from "../../models/fixtures/fixtures.interface";

async function createFixtures(fixtureRequest: FixtureRequest) {
  const { data, error } = await supabase
    .from("fixtures")
    .insert([fixtureRequest])
    .select();
  if (error) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.SDK_API_ERROR(
        error.message,
        500,
        error.code || ""
      )
    );
  }
  return data[0];
}

async function createParticipant(participantRequest: ParticipantRequest) {
  const { data, error } = await supabase
    .from("fixture_participants")
    .insert([participantRequest])
    .select();
  if (error) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.SDK_API_ERROR(
        error.message,
        500,
        error.code || ""
      )
    );
  }
  return data[0];
}

async function getFixturesForCategory(gameCategoryId: string, seasonId: string) {
  const { data, error } = await supabase
    .from("fixtures")
    .select("*")
    .eq("category_id", gameCategoryId)
    .eq("season_id", seasonId);
  if (error) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.SDK_API_ERROR(
        error.message,
        500,
        error.code || ""
      )
    );
  }
  return data;
}

async function getParticipantsForFixture(fixtureId: string) {
  const { data, error } = await supabase
    .from("fixture_participants")
    .select("*")
    .eq("fixture_id", fixtureId);
  if (error) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.SDK_API_ERROR(
        error.message,
        500,
        error.code || ""
      )
    );
  }
  if (!data || data.length === 0) {
    throw new Error("No participants found for the given fixture.");
  }

  // Extract unique teams and their participants
  const uniqueTeams: Record<string, any> = {};

  data.forEach((participant) => {
    if (!uniqueTeams[participant.team_id] && Object.keys(uniqueTeams).length < 2) {
      uniqueTeams[participant.team_id] = {
        participant_id: participant.participant_id,
        fixture_id: participant.fixture_id,
        team_id: participant.team_id,
        accepted: participant.accepted,
      };
    }
  });

  // Return only the two team participants as an array
  return Object.values(uniqueTeams);
}

export default {
  createFixtures,
  createParticipant,
  getFixturesForCategory,
  getParticipantsForFixture,
};
