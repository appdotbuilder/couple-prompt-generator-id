
import { db } from '../db';
import { generatedPromptsTable } from '../db/schema';
import { type GeneratedPrompt } from '../schema';
import { desc } from 'drizzle-orm';

export const getGeneratedPrompts = async (): Promise<GeneratedPrompt[]> => {
  try {
    // Query all generated prompts, ordered by creation date (newest first)
    const results = await db.select()
      .from(generatedPromptsTable)
      .orderBy(desc(generatedPromptsTable.created_at))
      .execute();

    // Return results as-is since no numeric conversions needed
    return results;
  } catch (error) {
    console.error('Failed to fetch generated prompts:', error);
    throw error;
  }
};
