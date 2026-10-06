import { useState, type SubmitEvent } from "react";
import useUsers from "../hooks/useUsers";
import "./Users.css";

export default function Users() {
  const { users, loadUsers, addUser, removeUser, error, loadingMessage } = useUsers();
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const loading = loadingMessage !== "";

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const success = await addUser({ nome: nome.trim(), idade: Number(idade) });
    if (success) {
      setNome("");
      setIdade("");
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <fieldset disabled={loading}>
          <legend>Cadastrar usuário</legend>
          <label htmlFor="nome">Nome</label>
          <input className="form-input" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required maxLength={120} />
          <label htmlFor="idade">Idade</label>
          <input className="form-input" id="idade" type="number" min={0} max={150} step={1} value={idade} onChange={(e) => setIdade(e.target.value)} required />
          <button type="submit">Cadastrar</button>
        </fieldset>
      </form>
      <p><button onClick={loadUsers} disabled={loading}>Listar usuários</button></p>
      {loadingMessage && <p role="status">{loadingMessage}</p>}
      {error && <p className="error message" role="alert">{error}</p>}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.nome} — {user.idade} anos{" "}
            <button onClick={() => removeUser(user.id)} disabled={loading}>Excluir</button>
          </li>
        ))}
      </ul>
    </>
  );
}
