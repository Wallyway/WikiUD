import { signInWithPopup } from "firebase/auth";
import React from "react";
import { auth, provider } from "./Firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const handleLogin = async () => {
    const loginResponse = await signInWithPopup(auth, provider);
    const user = loginResponse.user;
    const userData = {
      username: user.displayName,
      email: user.email,
      avatar: user.photoURL,
    };

    const response = await fetch("http://localhost:3000/api/v1/auth/login", {
      method: "post",
      credentials: "include", // Para poder enviar cookies
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.message);
      return;
    }

    navigate("/dashboard");
  };
  return (
    <div>
      <h1>Microsoft Login</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
