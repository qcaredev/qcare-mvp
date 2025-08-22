CREATE TABLE "branches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "clinics" RENAME TO "organizations";--> statement-breakpoint
ALTER TABLE "clinic_settings" RENAME TO "branch_settings";--> statement-breakpoint
ALTER TABLE "consult_history" RENAME COLUMN "clinic_id" TO "branch_id";--> statement-breakpoint
ALTER TABLE "branch_settings" DROP CONSTRAINT "clinic_settings_clinic_id_unique";--> statement-breakpoint
ALTER TABLE "branch_settings" DROP CONSTRAINT "clinic_settings_clinic_id_clinics_id_fk";
--> statement-breakpoint
ALTER TABLE "consult_history" DROP CONSTRAINT "consult_history_clinic_id_clinics_id_fk";
--> statement-breakpoint
ALTER TABLE "queue_items" DROP CONSTRAINT "queue_items_clinic_id_clinics_id_fk";
--> statement-breakpoint
ALTER TABLE "branch_settings" ADD COLUMN "branch_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "queue_items" ADD COLUMN "branch_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "branches" ADD CONSTRAINT "branches_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "branch_settings" ADD CONSTRAINT "branch_settings_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consult_history" ADD CONSTRAINT "consult_history_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "queue_items" ADD CONSTRAINT "queue_items_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "branch_settings" DROP COLUMN "clinic_id";--> statement-breakpoint
ALTER TABLE "queue_items" DROP COLUMN "clinic_id";--> statement-breakpoint
ALTER TABLE "branch_settings" ADD CONSTRAINT "branch_settings_branch_id_unique" UNIQUE("branch_id");