import { z } from 'zod';
import { publicProcedure, router } from '../trpc/trpc';
import { TRPCError } from '@trpc/server';

export interface Task {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: Date;
}

let tasks: Task[] = Array.from({ length: 25 }, (_, index) => ({
  id: (index + 1).toString(),
  titulo: `Tarefa #${index + 1}`,
  descricao: `Descrição ${index + 1}`,
  dataCriacao: new Date(Date.now() - index * 1000000),
}));

export const taskRouter = router({
  listar: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().nullish(),
      })
    )
    .query(({ input }) => {
      const { limit, cursor } = input;
      
      let items = [...tasks];

      if (cursor) {
        const cursorIndex = items.findIndex((t) => t.id === cursor);
        if (cursorIndex !== -1) {
          items = items.slice(cursorIndex + 1);
        }
      }

      const nextItems = items.slice(0, limit);
      let nextCursor: typeof cursor = undefined;

      if (items.length > limit) {
        nextCursor = nextItems[nextItems.length - 1].id;
      }

      return {
        items: nextItems,
        nextCursor,
      };
    }),

  criar: publicProcedure
    .input(
      z.object({
        titulo: z.string().min(1, 'O título é obrigatório.'),
        descricao: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      const novaTarefa: Task = {
        id: Date.now().toString(),
        titulo: input.titulo,
        descricao: input.descricao,
        dataCriacao: new Date(),
      };
      tasks.push(novaTarefa);
      return novaTarefa;
    }),

  atualizar: publicProcedure
    .input(
      z.object({
        id: z.string(),
        titulo: z.string().min(1, 'O título é obrigatório.'),
        descricao: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      const index = tasks.findIndex((t) => t.id === input.id);
      if (index === -1) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Tarefa não encontrada para atualização.',
        });
      }

      tasks[index] = {
        ...tasks[index],
        titulo: input.titulo,
        descricao: input.descricao ?? tasks[index].descricao,
      };

      return tasks[index];
    }),

  deletar: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      const index = tasks.findIndex((t) => t.id === input.id);
      if (index === -1) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Tarefa não encontrada para exclusão.',
        });
      }

      const [tarefaRemovida] = tasks.splice(index, 1);
      return tarefaRemovida;
    }),
});