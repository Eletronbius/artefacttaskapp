import { z } from 'zod';
import { publicProcedure, router } from '../trpc/trpc';
import { taskRouter } from './task';

export const appRouter = router({
  task: taskRouter,
});

export type AppRouter = typeof appRouter;