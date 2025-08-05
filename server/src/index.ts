
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas and handlers
import { 
  createPromptTemplateInputSchema,
  generatePromptInputSchema,
  randomizePromptInputSchema
} from './schema';
import { getPromptOptions } from './handlers/get_prompt_options';
import { createPromptTemplate } from './handlers/create_prompt_template';
import { getPromptTemplates } from './handlers/get_prompt_templates';
import { generatePrompt } from './handlers/generate_prompt';
import { randomizePrompt } from './handlers/randomize_prompt';
import { getGeneratedPrompts } from './handlers/get_generated_prompts';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  
  // Get all available options for dropdowns
  getPromptOptions: publicProcedure
    .query(() => getPromptOptions()),
  
  // Create a new prompt template
  createPromptTemplate: publicProcedure
    .input(createPromptTemplateInputSchema)
    .mutation(({ input }) => createPromptTemplate(input)),
  
  // Get all prompt templates
  getPromptTemplates: publicProcedure
    .query(() => getPromptTemplates()),
  
  // Generate a prompt from input parameters
  generatePrompt: publicProcedure
    .input(generatePromptInputSchema)
    .mutation(({ input }) => generatePrompt(input)),
  
  // Randomize prompt parameters
  randomizePrompt: publicProcedure
    .input(randomizePromptInputSchema)
    .mutation(({ input }) => randomizePrompt(input)),
  
  // Get generated prompt history
  getGeneratedPrompts: publicProcedure
    .query(() => getGeneratedPrompts()),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
