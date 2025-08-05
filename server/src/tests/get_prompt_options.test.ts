
import { describe, expect, it } from 'bun:test';
import { getPromptOptions } from '../handlers/get_prompt_options';

describe('getPromptOptions', () => {
  it('should return all prompt options', async () => {
    const result = await getPromptOptions();

    // Verify structure
    expect(result).toHaveProperty('themes');
    expect(result).toHaveProperty('visualStyles');
    expect(result).toHaveProperty('studioBackgrounds');
    expect(result).toHaveProperty('lighting');
    expect(result).toHaveProperty('cameraAngles');
    expect(result).toHaveProperty('couplePoses');
    expect(result).toHaveProperty('aspectRatios');

    // Verify themes array
    expect(result.themes).toBeArray();
    expect(result.themes).toContain("Formal");
    expect(result.themes).toContain("Traditional Javanese");
    expect(result.themes).toContain("Traditional Balinese");
    expect(result.themes).toHaveLength(6);

    // Verify visual styles array
    expect(result.visualStyles).toBeArray();
    expect(result.visualStyles).toContain("Realistic Photography");
    expect(result.visualStyles).toContain("Cinematic");
    expect(result.visualStyles).toContain("Anime Style");
    expect(result.visualStyles).toHaveLength(5);

    // Verify studio backgrounds array
    expect(result.studioBackgrounds).toBeArray();
    expect(result.studioBackgrounds).toContain("Plain Grey Wall");
    expect(result.studioBackgrounds).toContain("Classic Library Setting");
    expect(result.studioBackgrounds).toContain("Floral Wall");
    expect(result.studioBackgrounds).toHaveLength(6);

    // Verify lighting array
    expect(result.lighting).toBeArray();
    expect(result.lighting).toContain("Soft window light");
    expect(result.lighting).toContain("Dramatic neon lights");
    expect(result.lighting).toHaveLength(5);

    // Verify camera angles array
    expect(result.cameraAngles).toBeArray();
    expect(result.cameraAngles).toContain("Eye-level shot");
    expect(result.cameraAngles).toContain("High angle shot");
    expect(result.cameraAngles).toHaveLength(5);

    // Verify couple poses array
    expect(result.couplePoses).toBeArray();
    expect(result.couplePoses).toContain("Standing parallel, facing camera, soft expression");
    expect(result.couplePoses).toContain("Man slightly bowing to greet the woman");
    expect(result.couplePoses).toHaveLength(15);

    // Verify aspect ratios object
    expect(result.aspectRatios).toBeObject();
    expect(result.aspectRatios["Potret (2:3)"]).toBe("--ar 2:3");
    expect(result.aspectRatios["Potret (9:16)"]).toBe("--ar 9:16");
    expect(result.aspectRatios["Lanskap (3:2)"]).toBe("--ar 3:2");
    expect(result.aspectRatios["Persegi (1:1)"]).toBe("--ar 1:1");
    expect(result.aspectRatios["Layar Lebar (16:9)"]).toBe("--ar 16:9");
    expect(Object.keys(result.aspectRatios)).toHaveLength(5);
  });

  it('should return consistent data structure', async () => {
    const result1 = await getPromptOptions();
    const result2 = await getPromptOptions();

    // Verify both calls return identical data
    expect(result1).toEqual(result2);
  });

  it('should have no duplicate values in arrays', async () => {
    const result = await getPromptOptions();

    // Check for duplicates in each array
    expect(new Set(result.themes).size).toBe(result.themes.length);
    expect(new Set(result.visualStyles).size).toBe(result.visualStyles.length);
    expect(new Set(result.studioBackgrounds).size).toBe(result.studioBackgrounds.length);
    expect(new Set(result.lighting).size).toBe(result.lighting.length);
    expect(new Set(result.cameraAngles).size).toBe(result.cameraAngles.length);
    expect(new Set(result.couplePoses).size).toBe(result.couplePoses.length);
  });

  it('should have valid aspect ratio mappings', async () => {
    const result = await getPromptOptions();

    // Verify all aspect ratio values are valid Midjourney format
    Object.values(result.aspectRatios).forEach(value => {
      expect(value).toMatch(/^--ar \d+:\d+$/);
    });

    // Verify specific mappings are correct
    expect(result.aspectRatios["Potret (2:3)"]).toBe("--ar 2:3");
    expect(result.aspectRatios["Layar Lebar (16:9)"]).toBe("--ar 16:9");
  });
});
