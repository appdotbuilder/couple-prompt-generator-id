
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { promptTemplatesTable } from '../db/schema';
import { type CreatePromptTemplateInput } from '../schema';
import { createPromptTemplate } from '../handlers/create_prompt_template';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreatePromptTemplateInput = {
  name: 'Test Template',
  description: 'A template for testing',
  theme: 'Formal',
  visual_style: 'Realistic Photography',
  studio_background: 'Plain Grey Wall',
  lighting: 'Soft window light',
  camera_angle: 'Eye-level shot',
  couple_pose: 'Standing parallel, facing camera, soft expression',
  mens_top: 'Black suit jacket',
  mens_bottom: 'Black dress pants',
  womens_clothing: 'Elegant white dress',
  hijab_style: 'Simple white hijab',
  accessories: 'Wedding rings',
  aspect_ratio: '--ar 2:3',
  is_preset: false
};

describe('createPromptTemplate', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a prompt template', async () => {
    const result = await createPromptTemplate(testInput);

    // Basic field validation
    expect(result.name).toEqual('Test Template');
    expect(result.description).toEqual('A template for testing');
    expect(result.theme).toEqual('Formal');
    expect(result.visual_style).toEqual('Realistic Photography');
    expect(result.studio_background).toEqual('Plain Grey Wall');
    expect(result.lighting).toEqual('Soft window light');
    expect(result.camera_angle).toEqual('Eye-level shot');
    expect(result.couple_pose).toEqual('Standing parallel, facing camera, soft expression');
    expect(result.mens_top).toEqual('Black suit jacket');
    expect(result.mens_bottom).toEqual('Black dress pants');
    expect(result.womens_clothing).toEqual('Elegant white dress');
    expect(result.hijab_style).toEqual('Simple white hijab');
    expect(result.accessories).toEqual('Wedding rings');
    expect(result.aspect_ratio).toEqual('--ar 2:3');
    expect(result.is_preset).toEqual(false);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save prompt template to database', async () => {
    const result = await createPromptTemplate(testInput);

    // Query database to verify persistence
    const templates = await db.select()
      .from(promptTemplatesTable)
      .where(eq(promptTemplatesTable.id, result.id))
      .execute();

    expect(templates).toHaveLength(1);
    expect(templates[0].name).toEqual('Test Template');
    expect(templates[0].theme).toEqual('Formal');
    expect(templates[0].visual_style).toEqual('Realistic Photography');
    expect(templates[0].aspect_ratio).toEqual('--ar 2:3');
    expect(templates[0].is_preset).toEqual(false);
    expect(templates[0].created_at).toBeInstanceOf(Date);
  });

  it('should handle nullable fields correctly', async () => {
    const inputWithNulls: CreatePromptTemplateInput = {
      ...testInput,
      description: null,
      hijab_style: null,
      accessories: null
    };

    const result = await createPromptTemplate(inputWithNulls);

    expect(result.description).toBeNull();
    expect(result.hijab_style).toBeNull();
    expect(result.accessories).toBeNull();

    // Verify in database
    const templates = await db.select()
      .from(promptTemplatesTable)
      .where(eq(promptTemplatesTable.id, result.id))
      .execute();

    expect(templates[0].description).toBeNull();
    expect(templates[0].hijab_style).toBeNull();
    expect(templates[0].accessories).toBeNull();
  });

  it('should create preset template', async () => {
    const presetInput: CreatePromptTemplateInput = {
      ...testInput,
      name: 'System Preset',
      is_preset: true
    };

    const result = await createPromptTemplate(presetInput);

    expect(result.is_preset).toEqual(true);
    expect(result.name).toEqual('System Preset');

    // Verify in database
    const templates = await db.select()
      .from(promptTemplatesTable)
      .where(eq(promptTemplatesTable.id, result.id))
      .execute();

    expect(templates[0].is_preset).toEqual(true);
  });

  it('should handle all enum values correctly', async () => {
    const enumTestInput: CreatePromptTemplateInput = {
      ...testInput,
      theme: 'Traditional Javanese',
      visual_style: 'Anime Style',
      studio_background: 'Red Velvet Curtains',
      lighting: 'Dramatic neon lights',
      camera_angle: 'High angle shot',
      couple_pose: 'Man slightly bowing to greet the woman',
      aspect_ratio: '--ar 16:9'
    };

    const result = await createPromptTemplate(enumTestInput);

    expect(result.theme).toEqual('Traditional Javanese');
    expect(result.visual_style).toEqual('Anime Style');
    expect(result.studio_background).toEqual('Red Velvet Curtains');
    expect(result.lighting).toEqual('Dramatic neon lights');
    expect(result.camera_angle).toEqual('High angle shot');
    expect(result.couple_pose).toEqual('Man slightly bowing to greet the woman');
    expect(result.aspect_ratio).toEqual('--ar 16:9');
  });
});
