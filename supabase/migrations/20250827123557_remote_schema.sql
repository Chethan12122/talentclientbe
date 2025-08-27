

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."entity_type" AS ENUM (
    'TEAM',
    'ATHLETE'
);


ALTER TYPE "public"."entity_type" OWNER TO "postgres";


CREATE TYPE "public"."fixture_status" AS ENUM (
    'UPCOMING',
    'LIVE',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE "public"."fixture_status" OWNER TO "postgres";


CREATE TYPE "public"."fixture_type" AS ENUM (
    'LEAGUE',
    'SEMI_FINAL',
    'FINAL'
);


ALTER TYPE "public"."fixture_type" OWNER TO "postgres";


COMMENT ON TYPE "public"."fixture_type" IS 'Fixture type';



CREATE TYPE "public"."game_category_type" AS ENUM (
    'SINGLE',
    'TEAM'
);


ALTER TYPE "public"."game_category_type" OWNER TO "postgres";


CREATE TYPE "public"."role_type" AS ENUM (
    'ATHLETE',
    'REFEREE',
    'TEAM MANAGER',
    'ADMIN',
    'SUPER ADMIN'
);


ALTER TYPE "public"."role_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();  -- Update the updated_at field to the current timestamp
    RETURN NEW;  -- Return the updated row
END;
$$;


ALTER FUNCTION "public"."update_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."fixture_participants" (
    "participant_id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "fixture_id" "uuid",
    "user_id" "uuid",
    "team_id" "uuid",
    "accepted" boolean DEFAULT false
);


ALTER TABLE "public"."fixture_participants" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fixtures" (
    "fixture_id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "category_id" "uuid",
    "season_id" "uuid",
    "fixture_date" timestamp with time zone,
    "venue" character varying(255) NOT NULL,
    "status" "public"."fixture_status" DEFAULT 'UPCOMING'::"public"."fixture_status",
    "winner_team_id" "uuid",
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text"),
    "updated_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text"),
    "fixture_type" "public"."fixture_type" DEFAULT 'LEAGUE'::"public"."fixture_type",
    "referee_id" "text"
);


ALTER TABLE "public"."fixtures" OWNER TO "postgres";


COMMENT ON COLUMN "public"."fixtures"."fixture_type" IS 'Type of fixture [ LEAGUE, SEMI_FINAL , FINAL ]';



COMMENT ON COLUMN "public"."fixtures"."referee_id" IS 'Referee official for that fixture';



CREATE TABLE IF NOT EXISTS "public"."game_categories" (
    "category_id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "game_id" "uuid",
    "category_name" character varying(100) NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text"),
    "updated_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text"),
    "type" "public"."game_category_type"
);


ALTER TABLE "public"."game_categories" OWNER TO "postgres";


COMMENT ON COLUMN "public"."game_categories"."type" IS 'game category type';



CREATE TABLE IF NOT EXISTS "public"."games" (
    "game_id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "game_name" character varying(100) NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text"),
    "updated_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text")
);


ALTER TABLE "public"."games" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."institutes" (
    "institute_id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying NOT NULL,
    "venue" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text"),
    "updated_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text")
);


ALTER TABLE "public"."institutes" OWNER TO "postgres";


COMMENT ON TABLE "public"."institutes" IS 'table about institute';



CREATE TABLE IF NOT EXISTS "public"."scores" (
    "score_id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "fixture_id" "uuid",
    "referee_id" "uuid",
    "winning_team_id" "uuid",
    "losing_team_id" "uuid",
    "scores_key" "jsonb",
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'UTC'::"text")
);


ALTER TABLE "public"."scores" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."seasons" (
    "season_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "season_name" character varying NOT NULL,
    "start_date" "date" NOT NULL,
    "end_date" "date" NOT NULL,
    "break_start_date" "date",
    "break_end_date" "date",
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "updated_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL
);


ALTER TABLE "public"."seasons" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."teams" (
    "team_id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "institute_id" "uuid" NOT NULL,
    "team_type" character varying(50) NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text"),
    "updated_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text"),
    "season_id" "text"
);


ALTER TABLE "public"."teams" OWNER TO "postgres";


COMMENT ON COLUMN "public"."teams"."season_id" IS 'Team belonging to this season';



CREATE TABLE IF NOT EXISTS "public"."unified_leaderboard" (
    "leaderboard_id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "entity_type" "public"."entity_type" NOT NULL,
    "entity_id" "uuid" NOT NULL,
    "game_id" "uuid",
    "category_id" "uuid",
    "season_id" "uuid",
    "points" integer DEFAULT 0,
    "matches_played" integer DEFAULT 0,
    "matches_won" integer DEFAULT 0,
    "matches_lost" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'UTC'::"text"),
    "updated_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'UTC'::"text")
);


ALTER TABLE "public"."unified_leaderboard" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "user_id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "first_name" character varying(100) NOT NULL,
    "last_name" character varying(100) NOT NULL,
    "phone_number" character varying(15) NOT NULL,
    "role" "public"."role_type" NOT NULL,
    "profile_image_url" "text",
    "matches_officiated" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text"),
    "updated_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text"),
    "institute_id" "uuid",
    "game_categories" "text"[],
    "team_id" "uuid",
    "email" "text"
);


ALTER TABLE "public"."users" OWNER TO "postgres";


COMMENT ON COLUMN "public"."users"."game_categories" IS 'array of game categories';



COMMENT ON COLUMN "public"."users"."team_id" IS 'Team Id';



COMMENT ON COLUMN "public"."users"."email" IS 'email of user';



CREATE TABLE IF NOT EXISTS "public"."users_information" (
    "phone_number" character varying(15) NOT NULL,
    "date" "date" NOT NULL,
    "name" character varying(255) NOT NULL,
    "age" integer NOT NULL,
    "height" double precision NOT NULL,
    "weight" double precision NOT NULL,
    "sport" character varying(100) NOT NULL,
    "vertical_jump_trial1" double precision NOT NULL,
    "vertical_jump_trial2" double precision NOT NULL,
    "vertical_jump_trial3" double precision NOT NULL,
    "best_of_3_in_vertical_jump" double precision NOT NULL,
    "squat_jump_trial1" double precision NOT NULL,
    "squat_jump_trial2" double precision NOT NULL,
    "squat_jump_trial3" double precision NOT NULL,
    "best_of_3_in_squat_jump" double precision NOT NULL,
    "iso_belt_squat_trial1" double precision NOT NULL,
    "iso_belt_squat_trial2" double precision NOT NULL,
    "iso_belt_squat_trial3" double precision NOT NULL,
    "best_of_3_in_iso_belt_squat" double precision NOT NULL,
    "agility_test_trial1" double precision NOT NULL,
    "agility_test_trial2" double precision NOT NULL,
    "agility_test_trial3" double precision NOT NULL,
    "best_of_3_in_agility_test" double precision NOT NULL,
    "ten_meter_speed_trial1" double precision NOT NULL,
    "ten_meter_speed_trial2" double precision NOT NULL,
    "ten_meter_speed_trial3" double precision NOT NULL,
    "best_of_3_in_ten_meter_speed" double precision NOT NULL,
    "mb_throw_trial1" double precision NOT NULL,
    "mb_throw_trial2" double precision NOT NULL,
    "mb_throw_trial3" double precision NOT NULL,
    "best_of_3_in_mb_throw" double precision NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text"),
    "updated_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text"),
    "id" "uuid" DEFAULT "gen_random_uuid"()
);


ALTER TABLE "public"."users_information" OWNER TO "postgres";


COMMENT ON TABLE "public"."users_information" IS 'Users Info';



CREATE TABLE IF NOT EXISTS "public"."venue" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text"),
    "updated_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text")
);


ALTER TABLE "public"."venue" OWNER TO "postgres";


COMMENT ON TABLE "public"."venue" IS 'Venue';



ALTER TABLE ONLY "public"."fixture_participants"
    ADD CONSTRAINT "fixture_participants_pkey" PRIMARY KEY ("participant_id");



ALTER TABLE ONLY "public"."fixtures"
    ADD CONSTRAINT "fixtures_pkey" PRIMARY KEY ("fixture_id");



ALTER TABLE ONLY "public"."game_categories"
    ADD CONSTRAINT "game_categories_pkey" PRIMARY KEY ("category_id");



ALTER TABLE ONLY "public"."games"
    ADD CONSTRAINT "games_game_name_key" UNIQUE ("game_name");



ALTER TABLE ONLY "public"."games"
    ADD CONSTRAINT "games_pkey" PRIMARY KEY ("game_id");



ALTER TABLE ONLY "public"."institutes"
    ADD CONSTRAINT "institutes_pkey" PRIMARY KEY ("institute_id");



ALTER TABLE ONLY "public"."scores"
    ADD CONSTRAINT "scores_pkey" PRIMARY KEY ("score_id");



ALTER TABLE ONLY "public"."seasons"
    ADD CONSTRAINT "seasons_pkey" PRIMARY KEY ("season_id");



ALTER TABLE ONLY "public"."seasons"
    ADD CONSTRAINT "seasons_season_name_key" UNIQUE ("season_name");



ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_pkey" PRIMARY KEY ("team_id");



ALTER TABLE ONLY "public"."unified_leaderboard"
    ADD CONSTRAINT "unified_leaderboard_pkey" PRIMARY KEY ("leaderboard_id");



ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "unique_institute_team" UNIQUE ("institute_id", "team_type");



ALTER TABLE ONLY "public"."users_information"
    ADD CONSTRAINT "users_information_pkey" PRIMARY KEY ("phone_number", "date");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("user_id", "phone_number", "role");



ALTER TABLE ONLY "public"."venue"
    ADD CONSTRAINT "venue_pkey" PRIMARY KEY ("id");



CREATE UNIQUE INDEX "game_categories_game_id_category_name_idx" ON "public"."game_categories" USING "btree" ("game_id", "category_name");



CREATE UNIQUE INDEX "pk_unified_leaderboard" ON "public"."unified_leaderboard" USING "btree" ("entity_id", "game_id", "category_id", "season_id");



CREATE UNIQUE INDEX "unique_fixture_team" ON "public"."fixture_participants" USING "btree" ("fixture_id", "team_id");



CREATE OR REPLACE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."seasons" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "set_updated_at_fixtures" BEFORE UPDATE ON "public"."fixtures" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "set_updated_at_game_categories" BEFORE UPDATE ON "public"."game_categories" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "set_updated_at_games" BEFORE UPDATE ON "public"."games" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "set_updated_at_institute" BEFORE UPDATE ON "public"."institutes" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "set_updated_at_teams" BEFORE UPDATE ON "public"."teams" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "set_updated_at_users" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "set_updated_at_venue" BEFORE UPDATE ON "public"."venue" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



ALTER TABLE ONLY "public"."fixture_participants"
    ADD CONSTRAINT "fixture_participants_fixture_id_fkey" FOREIGN KEY ("fixture_id") REFERENCES "public"."fixtures"("fixture_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fixture_participants"
    ADD CONSTRAINT "fixture_participants_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("team_id");



ALTER TABLE ONLY "public"."fixtures"
    ADD CONSTRAINT "fixtures_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."game_categories"("category_id");



ALTER TABLE ONLY "public"."fixtures"
    ADD CONSTRAINT "fixtures_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("season_id");



ALTER TABLE ONLY "public"."fixtures"
    ADD CONSTRAINT "fixtures_winner_team_id_fkey" FOREIGN KEY ("winner_team_id") REFERENCES "public"."teams"("team_id");



ALTER TABLE ONLY "public"."game_categories"
    ADD CONSTRAINT "game_categories_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("game_id");



ALTER TABLE ONLY "public"."scores"
    ADD CONSTRAINT "scores_fixture_id_fkey" FOREIGN KEY ("fixture_id") REFERENCES "public"."fixtures"("fixture_id");



ALTER TABLE ONLY "public"."scores"
    ADD CONSTRAINT "scores_losing_team_id_fkey" FOREIGN KEY ("losing_team_id") REFERENCES "public"."teams"("team_id");



ALTER TABLE ONLY "public"."scores"
    ADD CONSTRAINT "scores_winning_team_id_fkey" FOREIGN KEY ("winning_team_id") REFERENCES "public"."teams"("team_id");



ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_institute_id_fkey" FOREIGN KEY ("institute_id") REFERENCES "public"."institutes"("institute_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."unified_leaderboard"
    ADD CONSTRAINT "unified_leaderboard_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."game_categories"("category_id");



ALTER TABLE ONLY "public"."unified_leaderboard"
    ADD CONSTRAINT "unified_leaderboard_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("game_id");



ALTER TABLE ONLY "public"."unified_leaderboard"
    ADD CONSTRAINT "unified_leaderboard_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("season_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_institute_id_fkey" FOREIGN KEY ("institute_id") REFERENCES "public"."institutes"("institute_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("team_id") ON DELETE CASCADE;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "service_role";



























GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."fixture_participants" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."fixture_participants" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."fixture_participants" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."fixtures" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."fixtures" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."fixtures" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."game_categories" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."game_categories" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."game_categories" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."games" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."games" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."games" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."institutes" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."institutes" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."institutes" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."scores" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."scores" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."scores" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."seasons" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."seasons" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."seasons" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."teams" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."teams" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."teams" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."unified_leaderboard" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."unified_leaderboard" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."unified_leaderboard" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."users" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."users" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."users" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."users_information" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."users_information" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."users_information" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."venue" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."venue" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."venue" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "service_role";






























RESET ALL;
