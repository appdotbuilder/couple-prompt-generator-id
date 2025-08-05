
import { serial, text, pgTable, timestamp, boolean, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Define enums
export const themeEnum = pgEnum('theme', [
  'traditional_indonesian',
  'modern_casual',
  'formal_elegant',
  'bohemian',
  'minimalist',
  'vintage',
  'beach',
  'urban',
  'garden',
  'cultural_fusion'
]);

export const visualStyleEnum = pgEnum('visual_style', [
  'cinematic',
  'portrait',
  'lifestyle',
  'documentary',
  'artistic',
  'candid',
  'fashion',
  'dreamy',
  'dramatic',
  'natural'
]);

export const studioBackgroundEnum = pgEnum('studio_background', [
  'white_seamless',
  'black_backdrop',
  'gray_gradient',
  'wooden_texture',
  'brick_wall',
  'fabric_drape',
  'nature_backdrop',
  'abstract_pattern',
  'solid_color',
  'textured_paper'
]);

export const lightingEnum = pgEnum('lighting', [
  'natural_light',
  'studio_lighting',
  'golden_hour',
  'soft_diffused',
  'dramatic_contrast',
  'rim_lighting',
  'low_key',
  'high_key',
  'warm_tone',
  'cool_tone'
]);

export const cameraAngleEnum = pgEnum('camera_angle', [
  'eye_level',
  'slightly_above',
  'slightly_below',
  'close_up',
  'medium_shot',
  'full_body',
  'three_quarter',
  'profile_view',
  'candid_angle',
  'artistic_perspective'
]);

export const couplePoseEnum = pgEnum('couple_pose', [
  'standing_embrace',
  'sitting_together',
  'walking_hand_in_hand',
  'forehead_touch',
  'back_to_back',
  'piggyback',
  'dancing_pose',
  'looking_at_each_other',
  'laughing_together',
  'romantic_gaze'
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
