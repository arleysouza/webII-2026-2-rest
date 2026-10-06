# Backend — API de usuários

API em Node.js, Express 5 e TypeScript, com persistência no PostgreSQL por meio do pacote `pg`.

## Estrutura do código

```text
backend/
├── src/
│   ├── server.ts
│   ├── app.ts
│   ├── db/
│   │   └── connection.ts
│   └── modules/
│       └── usuarios/
│           ├── usuarios.routes.ts
│           ├── usuarios.controller.ts
│           ├── usuarios.service.ts
│           └── usuarios.repository.ts
├── Dockerfile
├── package.json
└── tsconfig.json
```

| Arquivo | Responsabilidade |
| --- | --- |
| `server.ts` | Valida `PORT`, inicia o servidor e trata falhas ao escutar a porta. |
| `app.ts` | Configura JSON, `/health`, o módulo `/users`, resposta 404 e tratamento global de erros. |
| `db/connection.ts` | Cria o pool de conexões usando as variáveis `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER` e `PGPASSWORD`. |
| `usuarios.routes.ts` | Associa métodos e caminhos aos controllers; trata OPTIONS, métodos não permitidos e cache. |
| `usuarios.controller.ts` | Extrai dados da requisição, chama o service e define status, cabeçalhos e JSON da resposta. |
| `usuarios.service.ts` | Valida nome, idade e ID; trata usuário inexistente e nome duplicado com `UserServiceError`. |
| `usuarios.repository.ts` | Executa SQL parametrizado pelo pool e retorna os registros; define os tipos usados pelo módulo. |

## Fluxo de uma requisição

```text
Requisição → routes → controller → service → repository → pool → PostgreSQL
```

No cadastro, o controller lê `nome` e `idade`. O service valida e normaliza os dados, e o repository executa `INSERT ... RETURNING`. O controller retorna HTTP 201, o usuário criado e o cabeçalho `Location`.

Erros de negócio retornam o status definido por `UserServiceError`. Falhas inesperadas chegam ao middleware de `app.ts`: o detalhe é registrado no console e o cliente recebe HTTP 500 com `{ "erro": "Erro interno do servidor." }`.

## Rotas

| Método | Rota | Resultado |
| --- | --- | --- |
| GET | `/health` | Status da API, sem consulta ao banco |
| POST | `/users` | Cria usuário; HTTP 201 |
| GET | `/users` | Lista por ID; HTTP 200 |
| GET | `/users/:id` | Consulta usuário; HTTP 200 |
| PUT | `/users/:id` | Atualiza nome e idade; HTTP 200 |
| DELETE | `/users/:id` | Retorna o usuário excluído; HTTP 200 |

Nome deve ter entre 1 e 100 caracteres após remover espaços nas extremidades e deve ser único. Idade deve ser inteira entre 18 e 69. ID deve ser um inteiro positivo seguro. Dados inválidos retornam 400; usuário inexistente, 404; nome duplicado, 409. Uma lista vazia retorna `[]`.

## Execução

Para subir os containers, execute na raiz do projeto:

```bash
docker compose up -d --build
```

A API está publicada em `http://localhost:3002` com a configuração atual. No Compose, o banco é acessado por `database:5432`. Consulte [o README da raiz](../README.md) para configuração e persistência.

Exemplo de cadastro:

```bash
curl -i -X POST http://localhost:3002/users -H "Content-Type: application/json" -d '{"nome":"Ana","idade":25}'
```

## Desenvolvimento local

Na pasta `backend`, com Node.js 24:

```bash
npm install
npm run dev
```

Configure no ambiente do terminal `PGHOST=localhost`, `PGPORT=5433`, `PGDATABASE`, `PGUSER` e `PGPASSWORD` conforme o banco, e `PORT=3002` para usar o proxy atual do Vite. O backend não carrega `.env` automaticamente. A porta 3002 precisa estar livre; pare o container do backend se ele estiver usando essa porta.

`npm run build` compila para `dist`; `npm start` executa o código compilado. O Dockerfile compila a aplicação e copia apenas as dependências de produção e o resultado para a imagem final.
