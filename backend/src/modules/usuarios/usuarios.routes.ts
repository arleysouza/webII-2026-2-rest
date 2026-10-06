import { Router } from "express";
import {
  createUserController,
  deleteUserController,
  getUserController,
  listUserController,
  updateUserController,
} from "./usuarios.controller";

export const usuariosRoutes = Router();

usuariosRoutes.use((_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

usuariosRoutes.post("/", createUserController);
usuariosRoutes.get("/", listUserController);
usuariosRoutes.get("/:id", getUserController);
usuariosRoutes.put("/:id", updateUserController);
usuariosRoutes.delete("/:id", deleteUserController);

usuariosRoutes.options("/", (_req, res) => {
  res.set("Allow", "GET, HEAD, POST, OPTIONS").status(204).end();
});
usuariosRoutes.options("/:id", (_req, res) => {
  res.set("Allow", "GET, HEAD, PUT, DELETE, OPTIONS").status(204).end();
});

usuariosRoutes.all("/", (_req, res) => {
  res.set("Allow", "GET, HEAD, POST, OPTIONS")
    .status(405).json({ erro: "Método não permitido." });
});
usuariosRoutes.all("/:id", (_req, res) => {
  res.set("Allow", "GET, HEAD, PUT, DELETE, OPTIONS")
    .status(405).json({ erro: "Método não permitido." });
});
