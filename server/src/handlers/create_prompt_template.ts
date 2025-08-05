
import { db } from '../db';
import { promptTemplatesTable } from '../db/schema';
import { type CreatePromptTemplateInput, type PromptTemplate } from '../schema';

export const createPromptTemplate = async (input: CreatePromptTemplateInput): Promise<PromptTemplate> => {
  try {
    // Insert prompt template record
    const result = await db.insert(promptTemplatesTable)
      .values({
        name: input.name,
        description: input.description,
        theme: input.theme,
        visual_style: input.visual_style,
        studio_background: input.studio_background,
        lighting: input.lighting,
        camera_angle: input.camera_angle,
        couple_pose: input.couple_pose,
        mens_top: input.mens_top,
        mens_bottom: input.mens_bottom,
        womens_clothing: input.womens_clothing,
        hijab_style: input.hijab_style,
        accessories: input.accessories,
        aspect_ratio: input.aspect_ratio,
        is_preset: input.is_preset
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Prompt template creation failed:', error);
    throw error;
  }
};
