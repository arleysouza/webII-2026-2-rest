import { pool } from "../../db/connection";

export type UserType = {
  id: number;
  nome: string;
  idade: number;
};

export type CreateUserType = Omit<UserType, "id">;

export type UpdateUserType = UserType;

export async function createUserRepository({ nome, idade }: CreateUserType): Promise<UserType> {
  const result = await pool.query<UserType>(
    "INSERT INTO usuarios (nome, idade) VALUES ($1, $2) RETURNING id, nome, idade",
    [nome, idade],
  );
  return result.rows[0];
}

export async function listUserRepository(): Promise<UserType[]> {
  const result = await pool.query<UserType>(
    "SELECT id, nome, idade FROM usuarios ORDER BY id",
  );
  return result.rows;
}

export async function getUserRepository(id: number): Promise<UserType | null> {
  const result = await pool.query<UserType>(
    "SELECT id, nome, idade FROM usuarios WHERE id = $1",
    [id],
  );
  return result.rows[0] ?? null;
}

export async function deleteUserRepository(id: number): Promise<UserType | null> {
  const result = await pool.query<UserType>(
    "DELETE FROM usuarios WHERE id = $1 RETURNING id, nome, idade",
    [id],
  );
  return result.rows[0] ?? null;
}

export async function updateUserRepository({ id, nome, idade }: UpdateUserType): Promise<UserType | null> {
  const result = await pool.query<UserType>(
    "UPDATE usuarios SET nome = $1, idade = $2 WHERE id = $3 RETURNING id, nome, idade",
    [nome, idade, id],
  );
  return result.rows[0] ?? null;
}
