import UsersPage from "./pages/UsersPage";
import UserProvider from "./providers/UserProvider";

export default function App() {
  return (
    <UserProvider>
      <UsersPage />
    </UserProvider>
  );
}
