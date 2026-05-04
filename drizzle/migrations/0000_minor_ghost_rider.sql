CREATE TYPE "public"."direction" AS ENUM('UNIDIRECTIONAL', 'BIDIRECTIONAL');--> statement-breakpoint
CREATE TYPE "public"."entity_type" AS ENUM('LISTED_COMPANY', 'SOE', 'REGULATOR', 'MINISTRY', 'PRIVATE_COMPANY', 'SUBSIDIARY', 'INTERNATIONAL_ORG', 'SACCO', 'BANK');--> statement-breakpoint
CREATE TYPE "public"."impact_level" AS ENUM('LOW', 'MEDIUM', 'HIGH');--> statement-breakpoint
CREATE TYPE "public"."impact_type" AS ENUM('POSITIVE', 'NEGATIVE', 'NEUTRAL');--> statement-breakpoint
CREATE TYPE "public"."relationship_type" AS ENUM('OWNERSHIP', 'DEBT', 'REGULATORY', 'PARTNERSHIP', 'SUPPLY_CHAIN', 'BOARD_INTERLOCK', 'COMPETITOR', 'SUBSIDIARY_OF');--> statement-breakpoint
CREATE TYPE "public"."risk_level" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');--> statement-breakpoint
CREATE TYPE "public"."scraper_status" AS ENUM('RUNNING', 'SUCCESS', 'FAILED', 'PARTIAL');--> statement-breakpoint
CREATE TYPE "public"."sector" AS ENUM('BANKING', 'TELECOMMUNICATIONS', 'ENERGY', 'MANUFACTURING', 'AGRICULTURE', 'REAL_ESTATE', 'GOVERNMENT', 'REGULATION', 'DIVERSIFIED', 'INSURANCE', 'FINTECH', 'RETAIL', 'MEDIA', 'TRANSPORT');--> statement-breakpoint
CREATE TYPE "public"."trend" AS ENUM('UP', 'DOWN', 'STABLE');--> statement-breakpoint
CREATE TABLE "economic_events" (
	"id" text PRIMARY KEY NOT NULL,
	"date" timestamp NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"impact" "impact_level" NOT NULL,
	"impact_type" "impact_type" NOT NULL,
	"sectors" "sector"[] DEFAULT '{}' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"source" text,
	"source_url" text,
	"is_ai_extracted" boolean DEFAULT false NOT NULL,
	"raw_content" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_players" (
	"event_id" text NOT NULL,
	"player_id" text NOT NULL,
	CONSTRAINT "event_players_event_id_player_id_pk" PRIMARY KEY("event_id","player_id")
);
--> statement-breakpoint
CREATE TABLE "indicator_data_points" (
	"id" text PRIMARY KEY NOT NULL,
	"indicator_id" text NOT NULL,
	"date" timestamp NOT NULL,
	"value" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "indicator_players" (
	"indicator_id" text NOT NULL,
	"player_id" text NOT NULL,
	CONSTRAINT "indicator_players_indicator_id_player_id_pk" PRIMARY KEY("indicator_id","player_id")
);
--> statement-breakpoint
CREATE TABLE "macro_indicators" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"value" real NOT NULL,
	"unit" text NOT NULL,
	"trend" "trend" NOT NULL,
	"change_percent" real,
	"source" text NOT NULL,
	"as_of" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "macro_indicators_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "player_profile_history" (
	"id" text PRIMARY KEY NOT NULL,
	"player_id" text NOT NULL,
	"description" text NOT NULL,
	"key_facts" text[] DEFAULT '{}' NOT NULL,
	"risk_level" "risk_level" NOT NULL,
	"changed_at" timestamp DEFAULT now() NOT NULL,
	"changed_by" text DEFAULT 'system' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"sector" "sector" NOT NULL,
	"type" "entity_type" NOT NULL,
	"subtype" text NOT NULL,
	"founded" integer,
	"hq" text,
	"ownership" text,
	"revenue" text,
	"employees" text,
	"market_cap" text,
	"description" text NOT NULL,
	"key_facts" text[] DEFAULT '{}' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"risk_level" "risk_level" DEFAULT 'MEDIUM' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "players_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "query_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"query" text NOT NULL,
	"response" text NOT NULL,
	"latency_ms" integer NOT NULL,
	"prompt_tokens" integer DEFAULT 0 NOT NULL,
	"output_tokens" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "relationships" (
	"id" text PRIMARY KEY NOT NULL,
	"source_id" text NOT NULL,
	"target_id" text NOT NULL,
	"type" "relationship_type" NOT NULL,
	"label" text NOT NULL,
	"weight" integer DEFAULT 5 NOT NULL,
	"direction" "direction" DEFAULT 'BIDIRECTIONAL' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scraper_runs" (
	"id" text PRIMARY KEY NOT NULL,
	"scraper_name" text NOT NULL,
	"status" "scraper_status" NOT NULL,
	"items_found" integer DEFAULT 0 NOT NULL,
	"items_new" integer DEFAULT 0 NOT NULL,
	"error" text,
	"started_at" timestamp NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "event_players" ADD CONSTRAINT "event_players_event_id_economic_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."economic_events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_players" ADD CONSTRAINT "event_players_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "indicator_data_points" ADD CONSTRAINT "indicator_data_points_indicator_id_macro_indicators_id_fk" FOREIGN KEY ("indicator_id") REFERENCES "public"."macro_indicators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "indicator_players" ADD CONSTRAINT "indicator_players_indicator_id_macro_indicators_id_fk" FOREIGN KEY ("indicator_id") REFERENCES "public"."macro_indicators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "indicator_players" ADD CONSTRAINT "indicator_players_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_profile_history" ADD CONSTRAINT "player_profile_history_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_source_id_players_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_target_id_players_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_data_point" ON "indicator_data_points" USING btree ("indicator_id","date");--> statement-breakpoint
CREATE INDEX "indicator_date_idx" ON "indicator_data_points" USING btree ("indicator_id","date");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_relationship" ON "relationships" USING btree ("source_id","target_id","type");