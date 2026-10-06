# Frontend — Cadastro de usuários

Interface em React e TypeScript, com Vite para desenvolvimento e build. Permite cadastrar, listar e excluir usuários, exibindo mensagens de carregamento e erro.

## Estrutura do código

```text
frontend/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── pages/
│   │   ├── UsersPage.tsx
│   │   └── UsersPage.css
│   ├── components/
│   │   ├── Users.tsx
│   │   └── Users.css
│   ├── contexts/
│   │   └── UserContext.ts
│   ├── providers/
│   │   └── UserProvider.tsx
│   ├── hooks/
│   │   └── useUsers.ts
│   ├── services/
│   │   └── userService.ts
│   └── types/
│       └── user.ts
├── vite.config.ts
├── nginx.conf
├── Dockerfile
└── package.json
```

| Arquivo ou pasta | Responsabilidade |
| --- | --- |
| `main.tsx` | Monta o React no elemento `root`, ativa `StrictMode` e importa o CSS global. |
| `App.tsx` | Compõe a aplicação, envolvendo `UsersPage` com `UserProvider`. |
| `pages/UsersPage.tsx` | Representa a tela completa: organiza o título, o contêiner e o componente `Users`. |
| `components/Users.tsx` | Exibe formulário, botão de listagem, mensagens e lista com exclusão; mantém os valores dos campos no estado local. |
| `contexts/UserContext.ts` | Define o contexto e o contrato do estado e das operações disponíveis. |
| `providers/UserProvider.tsx` | Mantém usuários, erro e carregamento; chama os serviços e atualiza o estado após cada operação. |
| `hooks/useUsers.ts` | Facilita o acesso ao contexto e verifica se existe um provider acima do componente. |
| `services/userService.ts` | Executa `fetch` para listar, cadastrar e excluir; verifica respostas HTTP e propaga mensagens de erro. |
| `types/user.ts` | Define `User`, com ID, e `NewUser`, com os dados de cadastro. |
| `index.css` | Define estilos globais, fonte e regras básicas. |
| `UsersPage.css` e `Users.css` | Definem, respectivamente, os estilos da página e do componente. |

## Por que a página tem menos código que o componente?

A divisão entre `pages` e `components` segue a responsabilidade, não a quantidade de linhas. `UsersPage` compõe a tela; `Users` concentra seus elementos interativos. Por isso, uma página curta é válida.

Na estrutura atual, `Users` reúne formulário, lista e mensagens. Se essas partes crescerem, o formulário e a lista podem ser extraídos para `UserForm` e `UserList`, com coordenação pela página. Esses componentes ainda não existem no projeto; a divisão é uma possível evolução.

## Fluxo do cadastro

```text
Users → useUsers → UserProvider.addUser → userService.createUser
                                              ↓
                                      POST /api/users
```

`Users` impede o envio padrão do formulário, remove espaços nas extremidades do nome e converte a idade para número. O provider define o carregamento e chama o serviço. Se o cadastro funcionar, adiciona o registro retornado à lista e retorna `true`, permitindo limpar os campos. Se falhar, disponibiliza a mensagem de erro para a interface.

A listagem ocorre ao clicar em “Listar usuários”. A exclusão usa o ID e remove do estado o registro confirmado pelo backend. Durante as operações, os controles ficam desabilitados.

A API aplica as regras definitivas: nome de até 100 caracteres, único, e idade de 18 a 69. Atualmente, os campos HTML permitem até 120 caracteres e idade de 0 a 150; valores fora das regras do backend recebem erro da API.

## Comunicação com o backend

`userService.ts` usa `/api/users`. No desenvolvimento, `vite.config.ts` encaminha `/api` para `http://localhost:3002` e remove o prefixo. No container, `nginx.conf` faz o mesmo encaminhamento para `backend:${BACKEND_PORT}`.

O frontend implementa POST, GET da lista e DELETE. A API também oferece GET por ID e PUT, ainda sem controles correspondentes na interface.

## Execução

Para subir a aplicação completa, execute na raiz:

```bash
docker compose up -d --build
```

Com o `.env` atual, acesse `http://localhost:8080`. Consulte [o README da raiz](../README.md) para configuração dos serviços.

Para desenvolver a interface, execute na pasta `frontend`:

```bash
npm install
npm run dev
```

Mantenha o backend acessível em `http://localhost:3002` para o proxy do Vite e abra o endereço mostrado pelo comando.

```bash
npm run build
npm run lint
```

O build gera `dist`. O Dockerfile compila a interface e copia o resultado para a imagem Nginx, que serve os arquivos e encaminha as chamadas da API.
