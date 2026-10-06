import express, { type ErrorRequestHandler } from "express";
import { usuariosRoutes } from "./modules/usuarios/usuarios.routes";

export const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/users", usuariosRoutes);

app.use((_req, res) => {
  res.status(404).json({ erro: "Rota não encontrada." });
});

const handleError: ErrorRequestHandler = (error: unknown, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof SyntaxError && "type" in error && error.type === "entity.parse.failed") {
    res.status(400).json({ erro: "JSON inválido no corpo da requisição." });
    return;
  }

  console.error("Erro ao processar requisição:", error);
  res.status(500).json({ erro: "Erro interno do servidor." });
};

app.use(handleError);
