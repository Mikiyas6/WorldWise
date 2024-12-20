/*eslint-disable */
import { useEffect, useState } from "react";
import styles from "./Login.module.css";
import PageNav from "../components/PageNav";
import { useAuth } from "../contexts/FakeAuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
export default function Login() {
  const [email, setEmail] = useState("Mikiyas.Tewodroes@a2sv.org");
  const [password, setPassword] = useState("2222");
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (isAuthenticated) {
        navigate("/app", { replace: true });
      }
    },
    [isAuthenticated]
  );
  function handleSubmit(e) {
    e.preventDefault();
    if (email && password) login(email, password);
  }
  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Type your email"
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Type your password"
          />
        </div>

        <div>
          <Button type="primary">Login</Button>
        </div>
      </form>
    </main>
  );
}
