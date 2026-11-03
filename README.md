# Gerenciador de Tarefas — Next.js + tRPC

Funcionalidades:
Listagem com Infinite Scroll: Carregamento incremental de tarefas conforme o usuário rola a página, utilizando paginação baseada em cursor no backend.

Criação de Tarefas: Formulário interativo com validação de campos obrigatórios (título obrigatório).

Operações CRUD Completas bem simples: Todos os endpoints configurados para listar, criar, atualizar e deletar tarefas com tratamento de erros.

🛠️ Tecnologias Utilizadas
- Next.js 
- tRPC 
- Zod 
- @tanstack/react-query 
- Tailwind CSS
- TypeScript

Como Executar o Projeto Localmente
Siga os passos abaixo para clonar e rodar o projeto na sua máquina:

1. Pré-requisitos
Certifique-se de ter o Node.js (versão 18 ou superior) instalado no seu pc( acho dificil não ter, mas vai que ).

2. Instalação das Dependências
Clone o repositório, acesse a pasta do projeto e instale as dependências:

Bash
git clone https://github.com/Eletronbius/artefacttaskapp
cd artefacttaskapp
npm install
3. Executando em Ambiente de Desenvolvimento
Inicie o servidor de desenvolvimento do Next.js:

Bash
npm run dev
Ele deve te dar a url no console, mas caso não dê, o navegador e acesse:
http://localhost:3000

Endpoints do tRPC (taskRouter)
task.listar: Retorna uma lista paginada de tarefas utilizando cursor e limite.

task.criar: Cria uma nova tarefa validando se o título foi preenchido.

task.atualizar: Edita os dados de uma tarefa existente (lança erro NOT_FOUND se o ID não existir).

task.deletar: Remove uma tarefa pelo ID.