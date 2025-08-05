
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { 
  createPromptTemplateInputSchema, 
  generatePromptInputSchema, 
  randomizePromptInputSchema 
} from './schema';
import { createPromptTemplate } from './handlers/create_prompt_template';
import { getPromptTemplates } from './handlers/get_prompt_templates';
import { generatePrompt } from './handlers/generate_prompt';
import { randomizePrompt } from './handlers/randomize_prompt';
import { getPromptOptions } from './handlers/get_prompt_options';
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
  
  // Prompt template management
  createPromptTemplate: publicProcedure
    .input(createPromptTemplateInputSchema)
    .mutation(({ input }) => createPromptTemplate(input)),
  
  getPromptTemplates: publicProcedure
    .query(() => getPromptTemplates()),
  
  // Prompt generation
  generatePrompt: publicProcedure
    .input(generatePromptInputSchema)
    .mutation(({ input }) => generatePrompt(input)),
  
  randomizePrompt: publicProcedure
    .input(randomizePromptInputSchema)
    .mutation(({ input }) => randomizePrompt(input)),
  
  // Utility endpoints
  getPromptOptions: publicProcedure
    .query(() => getPromptOptions()),
  
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
