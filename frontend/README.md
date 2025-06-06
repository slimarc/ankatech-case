# Frontend - Web App

Este diretório contém a aplicação web frontend, desenvolvida com **Next.js**. Ela é responsável pela interface do usuário e consome a API do backend.

## 1. Visão Geral das Funcionalidades

O frontend oferece as seguintes funcionalidades principais:

### 1.1. Gerenciamento de Clientes (`/clients`)
- **Listagem:** Exibe uma tabela com clientes (nome, e-mail, status).
- **Adicionar:** Permite cadastrar novos clientes via modal de formulário.
- **Editar:** Permite atualizar clientes existentes via modal de formulário.
- **Excluir:** Permite remover clientes com confirmação via modal.
- **Feedback Visual:** Alertas de sucesso e erro são exibidos na tela para as operações.

### 1.2. Página de ativos (`/assets`)
- **Listagem:** Exibe a lista de ativos financeiros.
- **Adicionar:** Permite cadastrar novos ativos financeiros via modal de formulário.
- **Editar:** Permite atualizar ativos financeiros existentes via modal de formulário.
- **Excluir:** Permite remover ativos financeiros com confirmação via modal.


## 2. Tecnologias utilizadas

- **Next.js (App Router):** Framework React.
- **React:** Biblioteca UI.
- **ShadCN UI:** Componentes de interface.
- **React Query:** Busca e mutação de dados da API.
- **React Hook Form + Zod:** Formulários e validação.
- **Axios:** Requisições HTTP.
- **Tailwind CSS:** Estilização.
- **Lucide React:** Ícones.

## 3. Como rodar o frontend localmente (Desenvolvimento)

Para desenvolver o frontend com hot-reloading:

1.  **Certifique-se de que o Backend e o Banco de Dados estejam rodando via Docker Compose.**
    ```bash
    # Na raiz do monorepo 
    docker-compose up --build -d db backend
    ```
    O backend estará acessível em `http://localhost:4000`.

2.  **Configure o ambiente local do frontend.**
    Na pasta `./frontend/`, crie ou verifique o arquivo `.env.local` com a URL do backend:
    ```
    NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
    ```

3.  **Instale as dependências e inicie o servidor de desenvolvimento.**
    ```bash
    cd ./frontend/
    npm install
    npm run dev
    ```
    O frontend estará acessível em `http://localhost:3000`.
