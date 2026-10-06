import {
  createUserRepository,
  deleteUserRepository,
  getUserRepository,
  listUserRepository,
  updateUserRepository,
  type CreateUserType,
  type UpdateUserType,
  type UserType,
} from "./usuarios.repository";

export class UserServiceError extends Error {
  constructor(message: string, public readonly statusCode: number) {
    super(message);
    this.name = "UserServiceError";
  }
}

function validateId(id: number): void {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new UserServiceError("ID deve ser um inteiro positivo válido.", 400);
  }
}

function validateUser({ nome, idade }: CreateUserType): CreateUserType {
  if (typeof nome !== "string" || !nome.trim() || Array.from(nome.trim()).length > 100) {
    throw new UserServiceError("Nome deve ter entre 1 e 100 caracteres.", 400);
  }

  if (!Number.isInteger(idade) || idade < 18 || idade >= 70) {
    throw new UserServiceError("Idade deve ser um número inteiro entre 18 e 69 anos.", 400);
  }

  return { nome: nome.trim(), idade };
}

function handleRepositoryError(error: unknown): never {
  if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") {
    throw new UserServiceError("Já existe um usuário com esse nome.", 409);
  }
  throw error;
}

export async function createUserService(user: CreateUserType): Promise<UserType> {
  const data = validateUser(user);
  try {
    return await createUserRepository(data);
  } catch (error) {
    return handleRepositoryError(error);
  }
}

export async function listUserService(): Promise<UserType[]> {
  return listUserRepository();
}

export async function getUserService(id: number): Promise<UserType> {
  validateId(id);
  const user = await getUserRepository(id);
  if (!user) {
    throw new UserServiceError("Usuário não encontrado.", 404);
  }
  return user;
}

export async function deleteUserService(id: number): Promise<UserType> {
  validateId(id);
  const user = await deleteUserRepository(id);
  if (!user) {
    throw new UserServiceError("Usuário não encontrado.", 404);
  }
  return user;
}

export async function updateUserService({ id, nome, idade }: UpdateUserType): Promise<UserType> {
  validateId(id);
  const data = validateUser({ nome, idade });
  try {
    const user = await updateUserRepository({ id, ...data });
    if (!user) {
      throw new UserServiceError("Usuário não encontrado.", 404);
    }
    return user;
  } catch (error) {
    return handleRepositoryError(error);
  }
}
