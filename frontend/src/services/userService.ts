import type { NewUser, User } from "../types/user";

const API_URL = "/api/users";

async function checkResponse(response: Response) {
  if (!response.ok) {
    // O Express também pode responder com HTML quando ocorre um erro.
    const error = await response.json().catch(() => null);
    throw new Error(error?.erro || "Não foi possível concluir a requisição.");
  }
}

export async function getUsers(): Promise<User[]> {
  const response = await fetch(API_URL);
  await checkResponse(response);
  return response.json();
}

export async function createUser(user: NewUser): Promise<User> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  await checkResponse(response);
  return response.json();
}

export async function deleteUser(id: number): Promise<User> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  await checkResponse(response);
  return response.json();
}
