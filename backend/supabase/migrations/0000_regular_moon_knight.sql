DO $$ BEGIN
 CREATE TYPE "exercise_type" AS ENUM('cardio', 'strength');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exercises" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"created_by" integer,
	"name" varchar(256),
	"type" "exercise_type"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sets" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"workout_id" integer,
	"reps" integer,
	"weight" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"username" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workouts" (
	"workout_id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"created_by" integer,
	"exercise_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercises" ADD CONSTRAINT "exercises_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sets" ADD CONSTRAINT "sets_workout_id_workouts_workout_id_fk" FOREIGN KEY ("workout_id") REFERENCES "workouts"("workout_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workouts" ADD CONSTRAINT "workouts_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workouts" ADD CONSTRAINT "workouts_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
