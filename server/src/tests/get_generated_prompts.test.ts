
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { generatedPromptsTable } from '../db/schema';
import { type GeneratePromptInput } from '../schema';
import { getGeneratedPrompts } from '../handlers/get_generated_prompts';

// Test data for generated prompts
const testPrompt1: Omit<GeneratePromptInput, 'template_id'> = {
  theme: 'Formal',
  visual_style: 'Realistic Photography',
  studio_background: 'Plain Grey Wall',
  lighting: 'Soft window light',
  camera_angle: 'Eye-level shot',
  couple_pose: 'Standing parallel, facing camera, soft expression',
  mens_top: 'Black suit jacket',
  mens_bottom: 'Black dress pants',
  womens_clothing: 'White wedding dress',
  hijab_style: null,
  accessories: 'Wedding rings',
  aspect_ratio: '--ar 2:3'
};

const testPrompt2: Omit<GeneratePromptInput, 'template_id'> = {
  theme: 'Casual',
  visual_style: 'Cinematic',
  studio_background: 'Industrial Loft Window',
  lighting: 'Golden hour sunset glow',
  camera_angle: 'Full body shot',
  couple_pose: 'Looking at each other with a slight smile',
  mens_top: 'Blue denim shirt',
  mens_bottom: 'Dark jeans',
  womens_clothing: 'Floral summer dress',
  hijab_style: 'Simple white hijab',
  accessories: 'Casual watches',
  aspect_ratio: '--ar 16:9'
};

describe('getGeneratedPrompts', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no prompts exist', async () => {
    const result = await getGeneratedPrompts();
    
    expect(result).toEqual([]);
  });

  it('should return all generated prompts', async () => {
    // Insert test prompts
    await db.insert(generatedPromptsTable)
      .values([
        {
          ...testPrompt1,
          generated_prompt: 'A formal couple portrait in realistic photography style'
        },
        {
          ...testPrompt2,
          generated_prompt: 'A casual couple portrait with cinematic lighting'
        }
      ])
      .execute();

    const result = await getGeneratedPrompts();

    expect(result).toHaveLength(2);
    
    // Find each prompt by theme to avoid order dependency
    const formalPrompt = result.find(p => p.theme === 'Formal');
    const casualPrompt = result.find(p => p.theme === 'Casual');

    // Verify formal prompt
    expect(formalPrompt).toBeDefined();
    expect(formalPrompt!.visual_style).toEqual('Realistic Photography');
    expect(formalPrompt!.studio_background).toEqual('Plain Grey Wall');
    expect(formalPrompt!.lighting).toEqual('Soft window light');
    expect(formalPrompt!.camera_angle).toEqual('Eye-level shot');
    expect(formalPrompt!.couple_pose).toEqual('Standing parallel, facing camera, soft expression');
    expect(formalPrompt!.mens_top).toEqual('Black suit jacket');
    expect(formalPrompt!.mens_bottom).toEqual('Black dress pants');
    expect(formalPrompt!.womens_clothing).toEqual('White wedding dress');
    expect(formalPrompt!.hijab_style).toBeNull();
    expect(formalPrompt!.accessories).toEqual('Wedding rings');
    expect(formalPrompt!.aspect_ratio).toEqual('--ar 2:3');
    expect(formalPrompt!.generated_prompt).toEqual('A formal couple portrait in realistic photography style');
    expect(formalPrompt!.id).toBeDefined();
    expect(formalPrompt!.created_at).toBeInstanceOf(Date);
    expect(formalPrompt!.template_id).toBeNull();

    // Verify casual prompt
    expect(casualPrompt).toBeDefined();
    expect(casualPrompt!.theme).toEqual('Casual');
    expect(casualPrompt!.visual_style).toEqual('Cinematic');
    expect(casualPrompt!.studio_background).toEqual('Industrial Loft Window');
    expect(casualPrompt!.hijab_style).toEqual('Simple white hijab');
    expect(casualPrompt!.aspect_ratio).toEqual('--ar 16:9');
    expect(casualPrompt!.generated_prompt).toEqual('A casual couple portrait with cinematic lighting');
  });

  it('should return prompts ordered by creation date descending', async () => {
    // Insert prompts with specific timing
    const firstPrompt = await db.insert(generatedPromptsTable)
      .values({
        ...testPrompt1,
        generated_prompt: 'First prompt'
      })
      .returning()
      .execute();

    // Wait a moment to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    const secondPrompt = await db.insert(generatedPromptsTable)
      .values({
        ...testPrompt2,
        generated_prompt: 'Second prompt'
      })
      .returning()
      .execute();

    const result = await getGeneratedPrompts();

    expect(result).toHaveLength(2);
    // Newest should be first
    expect(result[0].generated_prompt).toEqual('Second prompt');
    expect(result[1].generated_prompt).toEqual('First prompt');
    expect(result[0].created_at >= result[1].created_at).toBe(true);
  });

  it('should handle prompts with nullable fields correctly', async () => {
    // Insert prompt with null values
    await db.insert(generatedPromptsTable)
      .values({
        theme: 'Fantasy',
        visual_style: 'Anime Style',
        studio_background: 'Bookshelf Backdrop',
        lighting: 'Dramatic neon lights',
        camera_angle: 'Close-up',
        couple_pose: 'Formal standing pose, hands in front',
        mens_top: 'Fantasy costume',
        mens_bottom: 'Fantasy pants',
        womens_clothing: 'Fantasy dress',
        hijab_style: null,
        accessories: null,
        aspect_ratio: '--ar 1:1',
        generated_prompt: 'Fantasy couple portrait',
        template_id: null
      })
      .execute();

    const result = await getGeneratedPrompts();

    expect(result).toHaveLength(1);
    expect(result[0].hijab_style).toBeNull();
    expect(result[0].accessories).toBeNull();
    expect(result[0].template_id).toBeNull();
    expect(result[0].theme).toEqual('Fantasy');
  });
});
