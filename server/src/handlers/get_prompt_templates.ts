
import { db } from '../db';
import { promptTemplatesTable } from '../db/schema';
import { type PromptTemplate } from '../schema';

export const getPromptTemplates = async (): Promise<PromptTemplate[]> => {
  try {
    const results = await db.select()
      .from(promptTemplatesTable)
      .execute();

    return results.map(template => ({
      ...template,
      created_at: new Date(template.created_at)
    }));
  } catch (error) {
    console.error('Failed to fetch prompt templates:', error);
    throw error;
  }
};
