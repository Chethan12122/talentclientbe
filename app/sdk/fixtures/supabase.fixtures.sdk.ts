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
  return data;
}

export default {
  createFixtures,
  createParticipant,
  getFixturesForCategory,
  getParticipantsForFixture,
};
