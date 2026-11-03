// src/app/page.tsx
'use client';

import Link from 'next/link';
import { trpc } from '@/trpc/client';
import { useEffect, useRef } from 'react';

export default function TasksPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = trpc.task.listar.useInfiniteQuery(
    { limit: 5 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <div className="max-w-2xl mx-auto p-6 font-sans">Carregando tarefas...</div>;
  }

  if (isError) {
    return <div className="max-w-2xl mx-auto p-6 font-sans text-red-600">Erro ao carregar tarefas.</div>;
  }

  const tasks = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <main className="max-w-2xl mx-auto p-6 font-sans pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lista de Tarefas (Rolagem Infinita)</h1>
        <Link
          href="/tasks/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
        >
          Nova Tarefa
        </Link>
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-500">Nenhuma tarefa encontrada.</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="p-4 border rounded-lg shadow-sm flex justify-between items-start bg-white dark:bg-zinc-900"
            >
              <div>
                <h2 className="font-semibold text-lg">{task.titulo}</h2>
                <p className="text-gray-600 dark:text-zinc-400 text-sm mt-1">
                  {task.descricao || 'Sem descrição'}
                </p>
                <span className="text-xs text-gray-400 mt-2 block">
                  Criado em: {new Date(task.dataCriacao).toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Elemento observador para disparar o carregamento ao rolar */}
      <div ref={loadMoreRef} className="py-6 text-center text-gray-500">
        {isFetchingNextPage
          ? 'Carregando mais tarefas...'
          : hasNextPage
          ? 'Role para carregar mais'
          : 'Você chegou ao fim da lista!'}
      </div>
    </main>
  );
}