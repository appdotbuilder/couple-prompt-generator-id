
import { z } from 'zod';

// Enums for predefined options with exact strings from frontend
export const themeEnum = z.enum([
  "Formal",
  "Casual",
  "Vintage",
  "Fantasy",
  "Traditional Javanese",
  "Traditional Balinese"
]);

export const visualStyleEnum = z.enum([
  "Realistic Photography",
  "Cinematic",
  "Black and White",
  "Oil Painting",
  "Anime Style"
]);

export const studioBackgroundEnum = z.enum([
  "Plain Grey Wall",
  "Classic Library Setting",
  "Industrial Loft Window",
  "Red Velvet Curtains",
  "Bookshelf Backdrop",
  "Floral Wall"
]);

export const lightingEnum = z.enum([
  "Soft window light",
  "Elegant studio lighting",
  "Golden hour sunset glow",
  "Dramatic neon lights",
  "Dim ambient light"
]);

export const cameraAngleEnum = z.enum([
  "Eye-level shot",
  "Full body shot",
  "Close-up",
  "Low angle shot",
  "High angle shot"
]);

export const couplePoseEnum = z.enum([
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
  aspect_ratio: z.string(), // Added aspect ratio field
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
  aspect_ratio: z.string(), // Added aspect ratio field
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
  aspect_ratio: z.string(), // Added aspect ratio field
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
  accessories: z.string().nullable(),
  aspect_ratio: z.string() // Added aspect ratio field
});

export type GeneratePromptInput = z.infer<typeof generatePromptInputSchema>;

export const randomizePromptInputSchema = z.object({
  preserve_attire: z.boolean().default(false),
  preserve_hijab: z.boolean().default(false)
});

export type RandomizePromptInput = z.infer<typeof randomizePromptInputSchema>;

// Response schemas
export const promptOptionsSchema = z.object({
  themes: z.array(themeEnum),
  visualStyles: z.array(visualStyleEnum),
  studioBackgrounds: z.array(studioBackgroundEnum),
  lighting: z.array(lightingEnum),
  cameraAngles: z.array(cameraAngleEnum),
  couplePoses: z.array(couplePoseEnum),
  aspectRatios: z.record(z.string(), z.string()) // Added aspect ratios
});

export type PromptOptions = z.infer<typeof promptOptionsSchema>;
