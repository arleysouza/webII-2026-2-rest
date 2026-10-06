import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export default function useUsers() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUsers deve ser usado dentro de UserProvider");
  }
  return context;
}
