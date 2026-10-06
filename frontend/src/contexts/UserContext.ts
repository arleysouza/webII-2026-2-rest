import { createContext } from "react";
import type { NewUser, User } from "../types/user";

export interface UserContextValue {
  users: User[];
  loadUsers: () => Promise<void>;
  addUser: (user: NewUser) => Promise<boolean>;
  removeUser: (id: number) => Promise<void>;
  error: string;
  loadingMessage: string;
}

export const UserContext = createContext<UserContextValue | undefined>(undefined);
