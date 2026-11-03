
import { appRouter } from '@/server/routers/_app';
import { createContext } from '@/server/trpc/context';

export async function getCaller() {
  const ctx = await createContext();
  return appRouter.createCaller(ctx);
}