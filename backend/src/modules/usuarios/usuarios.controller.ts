import type { NextFunction, Request, Response } from "express";
import {
  createUserService,
  deleteUserService,
  getUserService,
  listUserService,
  updateUserService,
  UserServiceError,
} from "./usuarios.service";

function handleServiceError(error: unknown, res: Response, next: NextFunction): void {
  if (error instanceof UserServiceError) {
    res.status(error.statusCode).json({ erro: error.message });
    return;
  }

  next(error);
}

export async function createUserController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { nome, idade } = req.body ?? {};
    const user = await createUserService({ nome, idade });
    res.location(`${req.baseUrl}/${user.id}`).status(201).json(user);
  } catch (error) {
    handleServiceError(error, res, next);
  }
}

export async function listUserController(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const users = await listUserService();
    res.status(200).json(users);
  } catch (error) {
    handleServiceError(error, res, next);
  }
}

export async function deleteUserController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const user = await deleteUserService(id);
    res.status(200).json(user);
  } catch (error) {
    handleServiceError(error, res, next);
  }
}

export async function getUserController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await getUserService(Number(req.params.id));
    res.status(200).json(user);
  } catch (error) {
    handleServiceError(error, res, next);
  }
}

export async function updateUserController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const { nome, idade } = req.body ?? {};
    const user = await updateUserService({ id, nome, idade });
    res.status(200).json(user);
  } catch (error) {
    handleServiceError(error, res, next);
  }
}
