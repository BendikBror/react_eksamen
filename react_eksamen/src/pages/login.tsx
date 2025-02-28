import React, { useState } from "react";
import "./css/login.css";
import { useAuth } from "../auth/AuthContext";
import Cookies from "js-cookie";
import { login as loginService } from "../auth/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login: loginUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Både brukernavn/e-post og passord er påkrevd.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const user = await loginService(email, password);
      Cookies.set("user", JSON.stringify(user), { expires: 7 });
      loginUser(user);
      navigate("/");
    } catch (error: any) {
      if (error.message === "Ugyldig e-post eller passord") {
        setErrorMessage("Feil brukernavn/e-post eller passord.");
      } else {
        setErrorMessage("Noe gikk galt. Prøv igjen senere.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>PadelMania</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Brukernavn eller e-post"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Passord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            disabled={loading}
          />
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logger inn..." : "Logg inn"}
          </button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <p className="register-text">
          Har du ikke bruker? <a href="/register">Registrer her</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
