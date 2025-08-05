
import { db } from '../db';
import { generatedPromptsTable } from '../db/schema';
import { type GeneratePromptInput, type GeneratedPrompt } from '../schema';

export const generatePrompt = async (input: GeneratePromptInput): Promise<GeneratedPrompt> => {
  try {
    // Construct the AI prompt text based on input parameters
    const promptParts = [
      `Create a ${input.theme.toLowerCase()} couple portrait`,
      `in ${input.visual_style.toLowerCase()} style.`,
      `Pose: ${input.couple_pose}.`,
      `Setting: ${input.studio_background}.`,
      `Lighting: ${input.lighting}.`,
      `Camera angle: ${input.camera_angle}.`,
      `Man wearing: ${input.mens_top}, ${input.mens_bottom}.`,
      `Woman wearing: ${input.womens_clothing}${input.hijab_style ? `, ${input.hijab_style}` : ''}.`
    ];

    if (input.accessories) {
      promptParts.push(`Accessories: ${input.accessories}.`);
    }

    promptParts.push(`Aspect ratio: ${input.aspect_ratio}`);

    const generatedPromptText = promptParts.join(' ');

    // Insert the generated prompt into the database
    const result = await db.insert(generatedPromptsTable)
      .values({
        template_id: input.template_id || null,
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
        generated_prompt: generatedPromptText
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Prompt generation failed:', error);
    throw error;
  }
};
