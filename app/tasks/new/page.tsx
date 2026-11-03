'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/trpc/client';

export default function NewTaskPage() {
  const router = useRouter();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [erroValidacao, setErroValidacao] = useState('');

  const utils = trpc.useUtils();
  const criarMutacao = trpc.task.criar.useMutation({
    onSuccess: () => {
      utils.task.listar.invalidate();
      router.push('/tasks');
    },
    onError: (err) => {
      setErroValidacao(err.message);
    },
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!titulo.trim()) {
      setErroValidacao('O campo de título é obrigatório.');
      return;
    }
    setErroValidacao('');
    criarMutacao.mutate({ titulo, descricao });
  };

  return (
    <main className="max-w-md mx-auto p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">Criar Nova Tarefa</h1>

      {erroValidacao && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded">
          {erroValidacao}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título *</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-zinc-800"
            placeholder="Ex: Fazer o teste técnico"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-zinc-800"
            placeholder="Detalhes"
          />
        </div>

        <button
          type="submit"
          disabled={criarMutacao.isPending}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {criarMutacao.isPending ? 'Salvando...' : 'Salvar Tarefa'}
        </button>
      </form>
    </main>
  );
}