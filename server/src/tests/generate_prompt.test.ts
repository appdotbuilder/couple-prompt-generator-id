
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { generatedPromptsTable } from '../db/schema';
import { type GeneratePromptInput } from '../schema';
import { generatePrompt } from '../handlers/generate_prompt';
import { eq } from 'drizzle-orm';

// Complete test input with all required fields
const testInput: GeneratePromptInput = {
  template_id: 1,
  theme: 'Formal',
  visual_style: 'Realistic Photography',
  studio_background: 'Plain Grey Wall',
  lighting: 'Soft window light',
  camera_angle: 'Eye-level shot',
  couple_pose: 'Standing parallel, facing camera, soft expression',
  mens_top: 'Black formal suit jacket',
  mens_bottom: 'Black formal trousers',
  womens_clothing: 'Elegant red evening dress',
  hijab_style: 'Modern silk hijab',
  accessories: 'Silver wedding rings',
  aspect_ratio: '--ar 2:3'
};

describe('generatePrompt', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should generate a prompt with all fields', async () => {
    const result = await generatePrompt(testInput);

    // Verify all input fields are preserved
    expect(result.template_id).toEqual(1);
    expect(result.theme).toEqual('Formal');
    expect(result.visual_style).toEqual('Realistic Photography');
    expect(result.studio_background).toEqual('Plain Grey Wall');
    expect(result.lighting).toEqual('Soft window light');
    expect(result.camera_angle).toEqual('Eye-level shot');
    expect(result.couple_pose).toEqual('Standing parallel, facing camera, soft expression');
    expect(result.mens_top).toEqual('Black formal suit jacket');
    expect(result.mens_bottom).toEqual('Black formal trousers');
    expect(result.womens_clothing).toEqual('Elegant red evening dress');
    expect(result.hijab_style).toEqual('Modern silk hijab');
    expect(result.accessories).toEqual('Silver wedding rings');
    expect(result.aspect_ratio).toEqual('--ar 2:3');

    // Verify generated fields
    expect(result.id).toBeDefined();
    expect(result.generated_prompt).toContain('formal couple portrait');
    expect(result.generated_prompt).toContain('realistic photography style');
    expect(result.generated_prompt).toContain('Black formal suit jacket');
    expect(result.generated_prompt).toContain('Modern silk hijab');
    expect(result.generated_prompt).toContain('Silver wedding rings');
    expect(result.generated_prompt).toContain('--ar 2:3');
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should generate prompt without optional fields', async () => {
    const minimalInput: GeneratePromptInput = {
      theme: 'Casual',
      visual_style: 'Cinematic',
      studio_background: 'Classic Library Setting',
      lighting: 'Golden hour sunset glow',
      camera_angle: 'Close-up',
      couple_pose: 'Looking at each other with a slight smile',
      mens_top: 'White casual shirt',
      mens_bottom: 'Blue jeans',
      womens_clothing: 'Floral summer dress',
      hijab_style: null,
      accessories: null,
      aspect_ratio: '--ar 1:1'
    };

    const result = await generatePrompt(minimalInput);

    expect(result.template_id).toBeNull();
    expect(result.hijab_style).toBeNull();
    expect(result.accessories).toBeNull();
    expect(result.generated_prompt).toContain('casual couple portrait');
    expect(result.generated_prompt).toContain('cinematic style');
    expect(result.generated_prompt).not.toContain('Accessories:');
    expect(result.generated_prompt).toContain('--ar 1:1');
  });

  it('should save generated prompt to database', async () => {
    const result = await generatePrompt(testInput);

    // Query the database to verify the record was saved
    const savedPrompts = await db.select()
      .from(generatedPromptsTable)
      .where(eq(generatedPromptsTable.id, result.id))
      .execute();

    expect(savedPrompts).toHaveLength(1);
    const savedPrompt = savedPrompts[0];
    
    expect(savedPrompt.theme).toEqual('Formal');
    expect(savedPrompt.visual_style).toEqual('Realistic Photography');
    expect(savedPrompt.generated_prompt).toContain('formal couple portrait');
    expect(savedPrompt.template_id).toEqual(1);
    expect(savedPrompt.aspect_ratio).toEqual('--ar 2:3');
    expect(savedPrompt.created_at).toBeInstanceOf(Date);
  });

  it('should construct prompt text correctly with all elements', async () => {
    const result = await generatePrompt(testInput);

    const prompt = result.generated_prompt;
    
    // Verify all elements are included in the prompt
    expect(prompt).toContain('Create a formal couple portrait');
    expect(prompt).toContain('in realistic photography style');
    expect(prompt).toContain('Pose: Standing parallel, facing camera, soft expression');
    expect(prompt).toContain('Setting: Plain Grey Wall');
    expect(prompt).toContain('Lighting: Soft window light');
    expect(prompt).toContain('Camera angle: Eye-level shot');
    expect(prompt).toContain('Man wearing: Black formal suit jacket, Black formal trousers');
    expect(prompt).toContain('Woman wearing: Elegant red evening dress, Modern silk hijab');
    expect(prompt).toContain('Accessories: Silver wedding rings');
    expect(prompt).toContain('Aspect ratio: --ar 2:3');
  });

  it('should handle different aspect ratio formats', async () => {
    const inputWithSquareRatio: GeneratePromptInput = {
      ...testInput,
      aspect_ratio: '--ar 1:1'
    };

    const result = await generatePrompt(inputWithSquareRatio);

    expect(result.aspect_ratio).toEqual('--ar 1:1');
    expect(result.generated_prompt).toContain('Aspect ratio: --ar 1:1');
  });
});
