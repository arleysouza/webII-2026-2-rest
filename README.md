# Cadastro de usuários — HTTP Request

Aplicação com frontend React e TypeScript, API Node.js com Express e banco PostgreSQL. A interface permite cadastrar, listar e excluir usuários; a API também oferece consulta por ID e atualização.

## Estrutura do projeto

```text
app/
├── frontend/       # Interface, estado compartilhado e cliente HTTP
├── backend/        # API, regras de negócio e consultas ao banco
├── database/       # Imagem PostgreSQL e schema.sql
├── compose.yaml    # Serviços, portas, dependências e volume
├── .env            # Configuração local
└── .env.example    # Modelo de configuração
```

Consulte a estrutura detalhada em [frontend/README.md](frontend/README.md) e [backend/README.md](backend/README.md).

## Fluxo do código

```text
UsersPage → Users → useUsers → UserProvider → userService
                                                 ↓ HTTP
Nginx (ou proxy do Vite) → routes → controller → service → repository → PostgreSQL
```

No frontend, a página compõe a tela, o componente exibe o formulário e a lista, o provider gerencia o estado e o serviço executa `fetch`. No backend, as rotas direcionam a requisição, o controller coordena a resposta HTTP, o service valida os dados e o repository executa SQL parametrizado.

O navegador chama `/api/users`. O proxy remove `/api` e encaminha a requisição para `/users` no backend. O retorno percorre o caminho inverso e atualiza o estado e a interface.

## Executar com Docker

Na raiz do projeto, configure `.env` a partir de `.env.example` e execute:

```bash
docker compose up -d --build
```

Com os valores atuais do `.env`:

| Serviço | Acesso pela máquina | Endereço interno |
| --- | --- | --- |
| Frontend | http://localhost:8080 | `frontend:80` |
| Backend | http://localhost:3002 | `backend:3000` |
| PostgreSQL | `localhost:5433` | `database:5432` |

`FRONT_PORT`, `API_PORT` e `PGHOST_PORT` definem as portas publicadas. `PORT` define a porta interna da API; `PGPORT`, a porta usada para conexão ao banco, que escuta em 5432 nesta imagem. Dentro do Compose, use `PGHOST=database`.

O backend aguarda o healthcheck do banco, e o frontend aguarda o da API. `/health` verifica se a API responde, sem testar uma consulta ao banco.

## Banco e persistência

`database/schema.sql` cria a tabela `usuarios`, com ID automático, nome único de até 100 caracteres e idade entre 18 e 69 anos. O script de inicialização roda quando o diretório de dados do PostgreSQL está vazio; não é um sistema de migrações.

O volume `postgres_data` preserva os dados ao recriar containers. Alterar a senha no `.env` não altera a senha de um banco já inicializado. `docker compose down` preserva o volume; `docker compose down -v` apaga também os dados.

```bash
docker compose logs -f backend
docker compose down
```
