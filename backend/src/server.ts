import { app } from "./app";

const port = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT deve ser um número inteiro entre 1 e 65535.");
}

const server = app.listen(port, () => {
  console.log(`API disponível na porta ${port}`);
});

server.on("error", (error) => {
  console.error("Não foi possível iniciar o servidor:", error);
  process.exitCode = 1;
});
