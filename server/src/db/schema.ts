
import { serial, text, pgTable, timestamp, boolean, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Define enums with exact strings from frontend
export const themeEnum = pgEnum('theme', [
  "Formal",
  "Casual",
  "Vintage",
  "Fantasy",
  "Traditional Javanese",
  "Traditional Balinese"
]);

export const visualStyleEnum = pgEnum('visual_style', [
  "Realistic Photography",
  "Cinematic",
  "Black and White",
  "Oil Painting",
  "Anime Style"
]);

export const studioBackgroundEnum = pgEnum('studio_background', [
  "Plain Grey Wall",
  "Classic Library Setting",
  "Industrial Loft Window",
  "Red Velvet Curtains",
  "Bookshelf Backdrop",
  "Floral Wall"
]);

export const lightingEnum = pgEnum('lighting', [
  "Soft window light",
  "Elegant studio lighting",
  "Golden hour sunset glow",
  "Dramatic neon lights",
  "Dim ambient light"
]);

export const cameraAngleEnum = pgEnum('camera_angle', [
  "Eye-level shot",
  "Full body shot",
  "Close-up",
  "Low angle shot",
  "High angle shot"
]);

export const couplePoseEnum = pgEnum('couple_pose', [
  "Standing parallel, facing camera, soft expression",
  "Man standing behind, woman sitting elegantly on a chair",
  "Looking at each other with a slight smile",
  "Man holding the woman's hand from the side",
  "Sitting side-by-side, slightly angled towards each other",
  "Woman seated, man sitting on the armrest",
  "Posed as if walking slowly, man slightly ahead",
  "Man holding the woman's arm from behind",
  "Sitting facing each other, hands on a small table",
  "Formal standing pose, hands in front",
  "Seated facing each other, half-body shot",
  "Man leaning against a wall, woman in front",
  "Woman holding a bouquet, man standing beside her",
  "Sitting on the studio floor with a carpet",
  "Man slightly bowing to greet the woman"
]);

// Prompt templates table for saving and reusing configurations
export const promptTemplatesTable = pgTable('prompt_templates', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'), // Nullable
  theme: themeEnum('theme').notNull(),
  visual_style: visualStyleEnum('visual_style').notNull(),
  studio_background: studioBackgroundEnum('studio_background').notNull(),
  lighting: lightingEnum('lighting').notNull(),
  camera_angle: cameraAngleEnum('camera_angle').notNull(),
  couple_pose: couplePoseEnum('couple_pose').notNull(),
  mens_top: text('mens_top').notNull(),
  mens_bottom: text('mens_bottom').notNull(),
  womens_clothing: text('womens_clothing').notNull(),
  hijab_style: text('hijab_style'), // Nullable - optional hijab
  accessories: text('accessories'), // Nullable - optional accessories
  aspect_ratio: text('aspect_ratio').notNull(), // Added aspect ratio field
  is_preset: boolean('is_preset').notNull().default(false), // Whether it's a system preset
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Generated prompts table for tracking usage and history
export const generatedPromptsTable = pgTable('generated_prompts', {
  id: serial('id').primaryKey(),
  template_id: integer('template_id'), // Nullable - can be generated without template
  theme: themeEnum('theme').notNull(),
  visual_style: visualStyleEnum('visual_style').notNull(),
  studio_background: studioBackgroundEnum('studio_background').notNull(),
  lighting: lightingEnum('lighting').notNull(),
  camera_angle: cameraAngleEnum('camera_angle').notNull(),
  couple_pose: couplePoseEnum('couple_pose').notNull(),
  mens_top: text('mens_top').notNull(),
  mens_bottom: text('mens_bottom').notNull(),
  womens_clothing: text('womens_clothing').notNull(),
  hijab_style: text('hijab_style'), // Nullable
  accessories: text('accessories'), // Nullable
  aspect_ratio: text('aspect_ratio').notNull(), // Added aspect ratio field
  generated_prompt: text('generated_prompt').notNull(), // The final AI prompt text
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const promptTemplatesRelations = relations(promptTemplatesTable, ({ many }) => ({
  generatedPrompts: many(generatedPromptsTable),
}));

export const generatedPromptsRelations = relations(generatedPromptsTable, ({ one }) => ({
  template: one(promptTemplatesTable, {
    fields: [generatedPromptsTable.template_id],
    references: [promptTemplatesTable.id],
  }),
}));

// TypeScript types for the table schemas
export type PromptTemplate = typeof promptTemplatesTable.$inferSelect;
export type NewPromptTemplate = typeof promptTemplatesTable.$inferInsert;
export type GeneratedPrompt = typeof generatedPromptsTable.$inferSelect;
export type NewGeneratedPrompt = typeof generatedPromptsTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = {
  promptTemplates: promptTemplatesTable,
  generatedPrompts: generatedPromptsTable
};
