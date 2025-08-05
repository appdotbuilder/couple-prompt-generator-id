
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { promptTemplatesTable } from '../db/schema';
import { getPromptTemplates } from '../handlers/get_prompt_templates';
import { type CreatePromptTemplateInput } from '../schema';

const testTemplate: CreatePromptTemplateInput = {
  name: 'Test Template',
  description: 'A test template for couples',
  theme: 'Formal',
  visual_style: 'Realistic Photography',
  studio_background: 'Plain Grey Wall',
  lighting: 'Soft window light',
  camera_angle: 'Eye-level shot',
  couple_pose: 'Standing parallel, facing camera, soft expression',
  mens_top: 'Black suit jacket',
  mens_bottom: 'Black dress pants',
  womens_clothing: 'White elegant dress',
  hijab_style: 'Simple white hijab',
  accessories: 'Wedding rings',
  aspect_ratio: '--ar 2:3',
  is_preset: false
};

const presetTemplate: CreatePromptTemplateInput = {
  name: 'Preset Template',
  description: null,
  theme: 'Traditional Javanese',
  visual_style: 'Oil Painting',
  studio_background: 'Red Velvet Curtains',
  lighting: 'Golden hour sunset glow',
  camera_angle: 'Full body shot',
  couple_pose: 'Man slightly bowing to greet the woman',
  mens_top: 'Traditional batik shirt',
  mens_bottom: 'Traditional sarong',
  womens_clothing: 'Traditional kebaya',
  hijab_style: null,
  accessories: null,
  aspect_ratio: '--ar 3:2',
  is_preset: true
};

describe('getPromptTemplates', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no templates exist', async () => {
    const result = await getPromptTemplates();

    expect(result).toEqual([]);
  });

  it('should return all prompt templates', async () => {
    // Create test templates
    await db.insert(promptTemplatesTable)
      .values([testTemplate, presetTemplate])
      .execute();

    const result = await getPromptTemplates();

    expect(result).toHaveLength(2);
    
    // Check first template
    const firstTemplate = result.find(t => t.name === 'Test Template');
    expect(firstTemplate).toBeDefined();
    expect(firstTemplate?.name).toEqual('Test Template');
    expect(firstTemplate?.description).toEqual('A test template for couples');
    expect(firstTemplate?.theme).toEqual('Formal');
    expect(firstTemplate?.visual_style).toEqual('Realistic Photography');
    expect(firstTemplate?.studio_background).toEqual('Plain Grey Wall');
    expect(firstTemplate?.lighting).toEqual('Soft window light');
    expect(firstTemplate?.camera_angle).toEqual('Eye-level shot');
    expect(firstTemplate?.couple_pose).toEqual('Standing parallel, facing camera, soft expression');
    expect(firstTemplate?.mens_top).toEqual('Black suit jacket');
    expect(firstTemplate?.mens_bottom).toEqual('Black dress pants');
    expect(firstTemplate?.womens_clothing).toEqual('White elegant dress');
    expect(firstTemplate?.hijab_style).toEqual('Simple white hijab');
    expect(firstTemplate?.accessories).toEqual('Wedding rings');
    expect(firstTemplate?.aspect_ratio).toEqual('--ar 2:3');
    expect(firstTemplate?.is_preset).toEqual(false);
    expect(firstTemplate?.id).toBeDefined();
    expect(firstTemplate?.created_at).toBeInstanceOf(Date);

    // Check preset template
    const presetTemplateResult = result.find(t => t.name === 'Preset Template');
    expect(presetTemplateResult).toBeDefined();
    expect(presetTemplateResult?.description).toBeNull();
    expect(presetTemplateResult?.theme).toEqual('Traditional Javanese');
    expect(presetTemplateResult?.hijab_style).toBeNull();
    expect(presetTemplateResult?.accessories).toBeNull();
    expect(presetTemplateResult?.is_preset).toEqual(true);
  });

  it('should return templates with correct date handling', async () => {
    await db.insert(promptTemplatesTable)
      .values(testTemplate)
      .execute();

    const result = await getPromptTemplates();

    expect(result).toHaveLength(1);
    expect(result[0].created_at).toBeInstanceOf(Date);
    expect(typeof result[0].created_at.getTime()).toBe('number');
  });

  it('should handle nullable fields correctly', async () => {
    const templateWithNulls: CreatePromptTemplateInput = {
      name: 'Minimal Template',
      description: null,
      theme: 'Casual',
      visual_style: 'Cinematic',
      studio_background: 'Bookshelf Backdrop',
      lighting: 'Dim ambient light',
      camera_angle: 'Close-up',
      couple_pose: 'Looking at each other with a slight smile',
      mens_top: 'Casual shirt',
      mens_bottom: 'Jeans',
      womens_clothing: 'Casual dress',
      hijab_style: null,
      accessories: null,
      aspect_ratio: '--ar 1:1',
      is_preset: false
    };

    await db.insert(promptTemplatesTable)
      .values(templateWithNulls)
      .execute();

    const result = await getPromptTemplates();

    expect(result).toHaveLength(1);
    expect(result[0].description).toBeNull();
    expect(result[0].hijab_style).toBeNull();
    expect(result[0].accessories).toBeNull();
  });
});
