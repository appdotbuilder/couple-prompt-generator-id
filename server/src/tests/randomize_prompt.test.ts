
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { type RandomizePromptInput } from '../schema';
import { randomizePrompt } from '../handlers/randomize_prompt';

describe('randomizePrompt', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should generate random prompt values', async () => {
    const input: RandomizePromptInput = {
      preserve_attire: false,
      preserve_hijab: false
    };

    const result = await randomizePrompt(input);

    // Verify all required fields are present
    expect(result.theme).toBeDefined();
    expect(result.visual_style).toBeDefined();
    expect(result.studio_background).toBeDefined();
    expect(result.lighting).toBeDefined();
    expect(result.camera_angle).toBeDefined();
    expect(result.couple_pose).toBeDefined();
    expect(result.mens_top).toBeDefined();
    expect(result.mens_bottom).toBeDefined();
    expect(result.womens_clothing).toBeDefined();
    expect(result.aspect_ratio).toBeDefined();

    // Verify theme is from valid options
    const validThemes = [
      "Formal", "Casual", "Vintage", "Fantasy", 
      "Traditional Javanese", "Traditional Balinese"
    ];
    expect(validThemes).toContain(result.theme);

    // Verify visual style is from valid options
    const validVisualStyles = [
      "Realistic Photography", "Cinematic", "Black and White",
      "Oil Painting", "Anime Style"
    ];
    expect(validVisualStyles).toContain(result.visual_style);

    // Verify aspect ratio is from valid options
    const validAspectRatios = ["--ar 2:3", "--ar 9:16", "--ar 3:2", "--ar 1:1", "--ar 16:9"];
    expect(validAspectRatios).toContain(result.aspect_ratio);
  });

  it('should preserve attire when preserve_attire is true', async () => {
    const input: RandomizePromptInput = {
      preserve_attire: true,
      preserve_hijab: false
    };

    const result = await randomizePrompt(input);

    expect(result.mens_top).toEqual("Preserved current attire");
    expect(result.mens_bottom).toEqual("Preserved current attire");
    expect(result.womens_clothing).toEqual("Preserved current attire");

    // Other fields should still be randomized
    expect(result.theme).toBeDefined();
    expect(result.visual_style).toBeDefined();
    expect(result.studio_background).toBeDefined();
  });

  it('should preserve hijab when preserve_hijab is true', async () => {
    const input: RandomizePromptInput = {
      preserve_attire: false,
      preserve_hijab: true
    };

    const result = await randomizePrompt(input);

    expect(result.hijab_style).toEqual("Preserved current hijab style");

    // Other fields should still be randomized
    expect(result.theme).toBeDefined();
    expect(result.visual_style).toBeDefined();
    expect(result.mens_top).toBeDefined();
    expect(result.womens_clothing).toBeDefined();
  });

  it('should preserve both attire and hijab when both flags are true', async () => {
    const input: RandomizePromptInput = {
      preserve_attire: true,
      preserve_hijab: true
    };

    const result = await randomizePrompt(input);

    expect(result.mens_top).toEqual("Preserved current attire");
    expect(result.mens_bottom).toEqual("Preserved current attire");
    expect(result.womens_clothing).toEqual("Preserved current attire");
    expect(result.hijab_style).toEqual("Preserved current hijab style");

    // Other fields should still be randomized
    expect(result.theme).toBeDefined();
    expect(result.visual_style).toBeDefined();
    expect(result.studio_background).toBeDefined();
    expect(result.lighting).toBeDefined();
    expect(result.camera_angle).toBeDefined();
    expect(result.couple_pose).toBeDefined();
    expect(result.accessories).toBeDefined();
    expect(result.aspect_ratio).toBeDefined();
  });

  it('should handle default values correctly', async () => {
    // Zod schema has defaults, so we need to pass the parsed type
    const input: RandomizePromptInput = {
      preserve_attire: false,
      preserve_hijab: false
    };

    const result = await randomizePrompt(input);

    // With defaults (preserve_attire: false, preserve_hijab: false),
    // attire and hijab should be randomized
    expect(result.mens_top).not.toEqual("Preserved current attire");
    expect(result.mens_bottom).not.toEqual("Preserved current attire");
    expect(result.womens_clothing).not.toEqual("Preserved current attire");
    
    // hijab_style can be null or a random style, but not preserved
    if (result.hijab_style !== null) {
      expect(result.hijab_style).not.toEqual("Preserved current hijab style");
    }
  });

  it('should generate different results on multiple calls', async () => {
    const input: RandomizePromptInput = {
      preserve_attire: false,
      preserve_hijab: false
    };

    const results = await Promise.all([
      randomizePrompt(input),
      randomizePrompt(input),
      randomizePrompt(input),
      randomizePrompt(input),
      randomizePrompt(input)
    ]);

    // With randomization, it's highly unlikely all results are identical
    // Check if at least one field differs across results
    const themes = results.map(r => r.theme);
    const visualStyles = results.map(r => r.visual_style);
    const backgrounds = results.map(r => r.studio_background);
    
    const allThemesSame = themes.every(theme => theme === themes[0]);
    const allVisualStylesSame = visualStyles.every(style => style === visualStyles[0]);
    const allBackgroundsSame = backgrounds.every(bg => bg === backgrounds[0]);
    
    // At least one field should vary across multiple calls
    expect(allThemesSame && allVisualStylesSame && allBackgroundsSame).toBe(false);
  });

  it('should handle nullable fields correctly', async () => {
    const input: RandomizePromptInput = {
      preserve_attire: false,
      preserve_hijab: false
    };

    const result = await randomizePrompt(input);

    // hijab_style and accessories can be null
    expect([
      "Simple draped hijab in neutral color",
      "Elegant wrapped hijab with subtle patterns", 
      "Traditional Indonesian jilbab style",
      "Modern layered hijab in pastel tones",
      null
    ]).toContain(result.hijab_style);

    expect([
      "Simple pearl earrings",
      "Traditional gold jewelry",
      "Minimalist watch and bracelet",
      "Vintage brooch on lapel", 
      "Small flower corsage",
      null
    ]).toContain(result.accessories);
  });
});
