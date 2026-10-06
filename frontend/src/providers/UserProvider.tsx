import { useState, type ReactNode } from "react";
import { UserContext } from "../contexts/UserContext";
import type { NewUser, User } from "../types/user";
import { getUsers, createUser, deleteUser } from "../services/userService";

export default function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");

  async function loadUsers() {
    try {
      setLoadingMessage("Buscando usuários...");
      setError("");
      const list = await getUsers();
      setUsers(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao buscar usuários.");
    } finally {
      setLoadingMessage("");
    }
  }

  async function addUser(user: NewUser) {
    try {
      setLoadingMessage("Cadastrando usuário...");
      setError("");
      const createdUser = await createUser(user);
      setUsers((current) => [...current, createdUser]);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao cadastrar usuário.");
      return false;
    } finally {
      setLoadingMessage("");
    }
  }

  async function removeUser(id: number) {
    try {
      setLoadingMessage("Excluindo usuário...");
      setError("");
      const deletedUser = await deleteUser(id);
      setUsers((current) => current.filter((user) => user.id !== deletedUser.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao excluir usuário.");
    } finally {
      setLoadingMessage("");
    }
  }

  return (
    <UserContext.Provider value={{ users, loadUsers, addUser, removeUser, error, loadingMessage }}>
      {children}
    </UserContext.Provider>
  );
}
