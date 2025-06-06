# Backend - API

Este diretório contém a implementação da API de backend, desenvolvida com Node.js, Fastify e Prisma.

## 1. Visão geral

A API é responsável por gerenciar dados de clientes e ativos financeiros, fornecendo endpoints para operações CRUD (Create, Read, Update, Delete). Ela se conecta a um banco de dados MySQL via Prisma ORM.

## 2. Tecnologias específicas

- **Node.js (v18-alpine):** Ambiente de execução.
- **Fastify (v5.x):** Framework web rápido e de baixo overhead.
- **Prisma ORM (v6.x):** ORM para interação com MySQL.
- **TypeScript (v5.x):** Linguagem de programação.
- **Zod (v3.x):** Validação de schemas e payloads.
- **`module-alias` (v2.x):** Para resolução de aliases de caminho em tempo de execução.

## 3. Modelos de dados (Schema Prisma)

Os principais modelos de dados gerenciados por esta API estão definidos no `prisma/schema.prisma`:

- **`Client`:** Representa os clientes do escritório de investimentos.
    - Campos: `id`, `name`, `email`, `status` (ativo/inativo)
    - Regra de Negócio: Não permite inativar clientes com ativos no portfólio.
    <br><br>
- **`Asset`:** Representa os ativos financeiros básicos.
    - Campos: `id`, `name`, `currentValue` (valor monetário, manipulado como `Decimal`)
    <br><br>
- **`Portfolio`:** Representa o portfólio de um cliente.
    - Campos: `id`, `clientId` (relação com Client)
    - Regra: Um cliente pode ter um portfólio. O portfolio é criado no momento em que um cliente adquire um ativo.
      <br><br>
- **`AssetHolding`:** Tabela pivot que representa a posse de um ativo por um cliente em um portfólio.
    - Campos: `id`, `portfolioId` (relação com Portfolio), `assetId` (relação com Asset), `quantity` (quantidade do ativo), `acquiredAt`, `updatedAt`.
    - Regra: Um cliente pode ter diversos ativos e os ativos podem estar em diversos portfolios. Adiciona o valor à quantidade existente se o ativo já existe no portfólio.
    
## 4. Endpoints da API

A API expõe os seguintes endpoints principais:

### Clientes (`/clients`)

| Método   | Endpoint          | Descrição                                         | Payload de Exemplo (Request)                                                | Resposta de Exemplo (Response)                                                                                                              |
|:---------| :---------------- | :------------------------------------------------ | :-------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| `POST`   | `/clients`        | Cadastra um novo cliente.                         | ```json { "name": "Novo Cliente", "email": "novo.cliente@email.com" } ```  | ```json { "id": "uuid", "name": "Novo Cliente", "email": "novo.cliente@email.com", "status": "ACTIVE"} ``` |
| `GET`    | `/clients`        | Lista todos os clientes com paginação e filtros.  | *(Nenhum)* | ```json { "clients": [...], "total": 10, "page": 1, "limit": 10 } ```                                                                    |
| `GET`    | `/clients/:id`    | Retorna detalhes de um cliente específico.        | *(Nenhum)* | ```json { "id": "uuid", "name": "Fulano", "email": "fulano@email.com", "status": "ACTIVE", "portfolio": {...} } ```                    |
| `PATCH`  | `/clients/:id`    | Atualiza dados de um cliente existente.           | ```json { "name": "Cliente Atualizado", "status": "INACTIVE" } ```         | ```json { "id": "uuid", "name": "Cliente Atualizado", "email": "...", "status": "INACTIVE"} ```                                    |
| `DELETE` | `/clients/:id`    | Remove um cliente pelo ID.                        | *(Nenhum)* | `Status 204 No Content`                                                                                                                     |

### Ativos financeiros (`/assets`)

| Método | Endpoint          | Descrição                                         | Payload de Exemplo (Request)                                          | Resposta de Exemplo (Response)                                                                                     |
| :----- | :---------------- | :------------------------------------------------ | :-------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------- |
| `POST` | `/assets`         | Cadastra um novo ativo financeiro.                | ```json { "name": "Nova Ação", "currentValue": "123.45" } ```       | ```json { "id": "uuid", "name": "Nova Ação", "currentValue": "123.45" } ``` |
| `GET`  | `/assets`         | Lista todos os ativos com paginação e filtros.    | *(Nenhum)* | ```json { "assets": [...], "total": 5, "page": 1, "limit": 10 } ```                                                |
| `GET`  | `/assets/:id`     | Retorna detalhes de um ativo específico.          | *(Nenhum)* | ```json { "id": "uuid", "name": "Ação XYZ", "currentValue": "50.00", ... } ```                                  |
| `PATCH`  | `/assets/:id`     | Atualiza dados de um ativo existente.             | ```json { "currentValue": "150.75" } ```                            | ```json { "id": "uuid", "name": "Ação XYZ", "currentValue": "150.75", ... } ```                                 |
| `DELETE` | `/assets/:id`     | Remove um ativo pelo ID.                          | *(Nenhum)* | `Status 204 No Content`                                                                                            |


### Portfolio (`/portfolios`)

| Método | Endpoint       | Descrição                                    | Payload de Exemplo (Request)                                          | Resposta de Exemplo (Response)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| :----- |:---------------|:---------------------------------------------| :-------------------------------------------------------------------- |:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GET`  | `/portfiolios`      | Lista todos os portfolios.                   | *(Nenhum)* | ```json [ { "id": "p001-abcd-1234", "client": { "id": "c001-efgh-5678", "name": "Carlos Souza", "email": "carlos.souza@gmail.com", "status": "ACTIVE" }, "assets": [ { "id": "a001-ijkl-9012", "name": "VALE3", "currentValue": "85.30", "quantity": "100.0000" } ] }, { "id": "p002-abcd-3456", "client": { "id": "c002-efgh-7890", "name": "Maria Silva", "email": "maria.silva@outlook.com", "status": "ACTIVE" }, "assets": [ { "id": "a002-ijkl-0123", "name": "Fundo Ações Brasil", "currentValue": "320.80", "quantity": "5.0000" } ] }, { "id": "p003-abcd-5678", "client": { "id": "c003-efgh-1234", "name": "João Pereira", "email": "joao.pereira@domain.com", "status": "ACTIVE" }, "assets": [ { "id": "a003-ijkl-4567", "name": "US Treasury Bond 2030", "currentValue": "102.75", "quantity": "2.0000" } ] } ] ```                                                                   |
| `GET`  | `/portfiolios/:id`  | Retorna detalhes de um portfolio específico. | *(Nenhum)* | ```json { "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef", "client": { "id": "c1c2c3c4-d5d6-7e8f-9012-345678abcdef", "name": "Carlos Souza", "email": "carlos.souza@gmail.com", "status": "ACTIVE" }, "assets": [ { "id": "a1a2a3a4-b5b6-7c8d-9012-345678abcdef", "name": "VALE3", "currentValue": "85.30", "quantity": "100.0000" }, { "id": "b1b2b3b4-c5c6-7d8e-9012-345678abcdef", "name": "Fundo Ações Brasil", "currentValue": "320.80", "quantity": "5.0000" }, { "id": "d1d2d3d4-e5e6-7f8g-9012-345678abcdef", "name": "US Treasury Bond 2030", "currentValue": "102.75", "quantity": "2.0000" } ] } ```                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `DELETE` | `/portfiolios/:id`  | Remove pelo ID.                              | *(Nenhum)* | `Status 204 No Content`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |


### Asset holdings (`/asset-holdings`)

| Método | Endpoint              | Descrição                                                                        | Payload de Exemplo (Request)                                                | Resposta de Exemplo (Response)                                                                                                              |
| :----- |:----------------------|:---------------------------------------------------------------------------------| :-------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| `POST` | `/asset-holdings`     | Adiciona um ativo ao portfólio de um cliente ou atualiza a quantidade existente. | ```json { "clientId": "uuid", "assetId": "uuid", "quantity": "10.5000" } ``` | ```json { "id": "uuid", "name": "Nome Ativo", "currentValue": "100.00", "quantity": "10.5000" } ``` |
| `GET`  | `/asset-holdings/:id` | Captura a movimentação específica entre ativo e um portfolio                     | *(Nenhum)* | ```json { "holdings": [...], "total": 3, "page": 1, "limit": 10 } ```                                                                    |
| `PATCH`  | `/asset-holdings/:id` | Atualiza a quantidade de um ativo no portfólio.                                  | ```json { "portfolioId": "e1a6b659-a6ec-4cf5-8605-7cdbb921b6ef", "assetId": "a5813c2b-acb6-46d4-8fb9-8a36771f4725", "quantity": "10" }``` | ```json { "id": "uuid", "name": "Nome Ativo", "currentValue": "100.00", "quantity": "15.0000" } ``` | |

## 5. Como rodar o backend localmente (Isoladamente - modo dev)

Para rodar apenas o serviço de backend isoladamente (sem o frontend ou Docker Compose completo):

1.  **Certifique-se de que o MySQL local esteja rodando** (ou um contêiner MySQL separado, acessível via `localhost:3306`).
2.  **Navegue até a pasta do backend
3.  **Instale as dependências:** `npm install`
4.  **Crie um arquivo `.env`** com a `DATABASE_URL` apontando para o seu MySQL local:
    ```
    # .env
    DATABASE_URL="mysql://root:SUA_SENHA_LOCAL@localhost:3306/investdb"
    ```
5.  **Aplique as migrações Prisma:** `npx prisma migrate dev --name init`
6.  **Inicie o servidor de desenvolvimento:** `npm run dev`

---