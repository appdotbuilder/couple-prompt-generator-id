
import { z } from 'zod';

// Enums for predefined options
export const themeEnum = z.enum([
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

export const visualStyleEnum = z.enum([
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

export const studioBackgroundEnum = z.enum([
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

export const lightingEnum = z.enum([
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

export const cameraAngleEnum = z.enum([
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

export const couplePoseEnum = z.enum([
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

// Prompt template schema
export const promptTemplateSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  theme: themeEnum,
  visual_style: visualStyleEnum,
  studio_background: studioBackgroundEnum,
  lighting: lightingEnum,
  camera_angle: cameraAngleEnum,
  couple_pose: couplePoseEnum,
  mens_top: z.string(),
  mens_bottom: z.string(),
  womens_clothing: z.string(),
  hijab_style: z.string().nullable(),
  accessories: z.string().nullable(),
  is_preset: z.boolean(),
  created_at: z.coerce.date()
});

export type PromptTemplate = z.infer<typeof promptTemplateSchema>;

// Generated prompt schema
export const generatedPromptSchema = z.object({
  id: z.number(),
  template_id: z.number().nullable(),
  theme: themeEnum,
  visual_style: visualStyleEnum,
  studio_background: studioBackgroundEnum,
  lighting: lightingEnum,
  camera_angle: cameraAngleEnum,
  couple_pose: couplePoseEnum,
  mens_top: z.string(),
  mens_bottom: z.string(),
  womens_clothing: z.string(),
  hijab_style: z.string().nullable(),
  accessories: z.string().nullable(),
  generated_prompt: z.string(),
  created_at: z.coerce.date()
});

export type GeneratedPrompt = z.infer<typeof generatedPromptSchema>;

// Input schemas
export const createPromptTemplateInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
  theme: themeEnum,
  visual_style: visualStyleEnum,
  studio_background: studioBackgroundEnum,
  lighting: lightingEnum,
  camera_angle: cameraAngleEnum,
  couple_pose: couplePoseEnum,
  mens_top: z.string().min(1),
  mens_bottom: z.string().min(1),
  womens_clothing: z.string().min(1),
  hijab_style: z.string().nullable(),
  accessories: z.string().nullable(),
  is_preset: z.boolean().default(false)
});

export type CreatePromptTemplateInput = z.infer<typeof createPromptTemplateInputSchema>;

export const generatePromptInputSchema = z.object({
  template_id: z.number().optional(),
  theme: themeEnum,
  visual_style: visualStyleEnum,
  studio_background: studioBackgroundEnum,
  lighting: lightingEnum,
  camera_angle: cameraAngleEnum,
  couple_pose: couplePoseEnum,
  mens_top: z.string().min(1),
  mens_bottom: z.string().min(1),
  womens_clothing: z.string().min(1),
  hijab_style: z.string().nullable(),
  accessories: z.string().nullable()
});

export type GeneratePromptInput = z.infer<typeof generatePromptInputSchema>;

export const randomizePromptInputSchema = z.object({
  preserve_attire: z.boolean().default(false),
  preserve_hijab: z.boolean().default(false)
});

export type RandomizePromptInput = z.infer<typeof randomizePromptInputSchema>;

// Response schemas
export const promptOptionsSchema = z.object({
  themes: z.array(z.string()),
  visualStyles: z.array(z.string()),
  studioBackgrounds: z.array(z.string()),
  lighting: z.array(z.string()),
  cameraAngles: z.array(z.string()),
  couplePoses: z.array(z.string())
});

export type PromptOptions = z.infer<typeof promptOptionsSchema>;
