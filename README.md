# 🥗 API Daily Diet

Uma API REST para controle de dieta diária, construída com Fastify, TypeScript e PostgreSQL.

## 📋 Sobre

Esta API permite que usuários registrem e gerenciem suas refeições diárias, controlando quais estão dentro ou fora da dieta. Cada usuário é identificado por um cookie de sessão, garantindo que cada pessoa visualize e gerencie apenas suas próprias refeições.

## 🚀 Tecnologias

- **[Fastify](https://fastify.dev/)** — Framework web rápido e de baixo overhead
- **[TypeScript](https://www.typescriptlang.org/)** — Tipagem estática para JavaScript
- **[Knex.js](https://knexjs.org/)** — Query builder SQL e migrations
- **[PostgreSQL](https://www.postgresql.org/)** — Banco de dados relacional em produção (Neon)
- **[SQLite](https://www.sqlite.org/)** — Banco de dados relacional leve para desenvolvimento e testes
- **[Zod](https://zod.dev/)** — Validação de esquemas em tempo de execução
- **[Vitest](https://vitest.dev/)** — Testes unitários e de integração
- **[@fastify/cookie](https://github.com/fastify/fastify-cookie)** — Gerenciamento de cookies
- **[dotenv](https://github.com/motdotla/dotenv)** — Gerenciamento de variáveis de ambiente

## 📁 Estrutura do Projeto

```
src/
├── middleware/
│   └── check-session-id-exists.ts  # Middleware de autenticação por sessão
├── routes/
│   ├── meals.ts                    # Rotas de refeições
│   └── users.ts                    # Rotas de usuários
├── test/
│   ├── meals.spec.ts               # Testes das rotas de refeições
│   └── users.spec.ts               # Testes das rotas de usuários
├── app.ts                          # Configuração do app Fastify
├── database.ts                     # Configuração do Knex
├── env.ts                          # Validação das variáveis de ambiente
└── server.ts                       # Ponto de entrada do servidor

db/
└── migrations/                     # Migrations do banco de dados
```

## 🌐 Deploy

API disponível em produção: [https://api-daily-diet-1ouh.onrender.com](https://api-daily-diet-1ouh.onrender.com)

## ⚙️ Como Rodar

### Pré-requisitos

- Node.js 18+
- npm

### Instalação

```bash
# Clone o repositório
git clone https://github.com/velosogustavo/api-daily-diet.git
cd api-daily-diet

# Instale as dependências
npm install
```

### Variáveis de Ambiente

Copie o arquivo de exemplo e preencha os valores:

```bash
# Linux/Mac
cp .env.example .env

# Windows
copy .env.example .env
```

Variáveis necessárias:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `NODE_ENV` | Ambiente de execução | `development` |
| `DATABASE_CLIENT` | Cliente do banco de dados | `better-sqlite3` ou `pg` |
| `DATABASE_URL` | Caminho do SQLite ou URL do PostgreSQL | `./db/app.db` ou `postgresql://user:pass@host/db` |
| `PORT` | Porta em que o servidor irá rodar | `3333` |

### Executando as Migrations

```bash
npm run migrate:latest
```

### Rodando o Servidor

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Build de produção
npm run build
npm start
```

## 🧪 Testes

```bash
npm test
```

Os testes utilizam um banco de dados dedicado (`.env.test`) para não interferir nos dados de desenvolvimento.

Casos cobertos:

- Criação de um novo usuário
- Criação de uma refeição
- Listagem de todas as refeições do usuário
- Busca de uma refeição específica por ID
- Atualização de uma refeição
- Remoção de uma refeição
- Métricas do usuário

## 📌 Rotas da API

### Usuários

#### Criar um usuário

```http
POST /users
```

**Body:**

```json
{
  "name": "John Doe"
}
```

> Um cookie de sessão (`sessionId`) é criado automaticamente e é necessário para todas as rotas de refeições.

---

### Refeições

> 🔒 Todas as rotas de refeições exigem cookie de sessão válido. Requisições sem ele recebem `401 Unauthorized`.

#### Criar uma refeição

```http
POST /meals
```

**Body:**

```json
{
  "name": "Breakfast",
  "description": "Eggs and toast",
  "date_time": "2026-06-05T08:00:00.000Z",
  "is_on_diet": true
}
```

---

#### Listar todas as refeições

```http
GET /meals
```

---

#### Buscar uma refeição pelo ID

```http
GET /meals/:id
```

---

#### Atualizar uma refeição

```http
PUT /meals/:id
```

**Body:** (todos os campos são opcionais)

```json
{
  "name": "Lunch",
  "description": "Chicken and rice",
  "date_time": "2026-06-05T12:00:00.000Z",
  "is_on_diet": true
}
```

---

#### Apagar uma refeição

```http
DELETE /meals/:id
```

---

#### Métricas do usuário

```http
GET /meals/metrics
```

**Resposta:**

```json
{
  "totalMeals": 10,
  "totalOnDiet": 7,
  "totalOffDiet": 3,
  "bestSequence": 5
}
```

---

## 🔒 Autenticação

A autenticação é feita via cookie `sessionId`, criado automaticamente ao criar um usuário (`POST /users`). Todas as rotas de refeições exigem esse cookie.

## 📜 Licença

ISC
