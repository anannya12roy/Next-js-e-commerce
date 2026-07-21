"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/actions/authActions";
import './admin-global.css';

export default function LoginPage() {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser(email, password);

      if (response.success) {
        // Save token
        localStorage.setItem("token", response.token as string);
        localStorage.setItem("user", JSON.stringify(response.user));
        // Redirect to dashboard
        router.push("/admin/dashboard");
      } else {
        setError(response.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginContainer">
      <div className="blob"></div>
      <div className="blob2"></div>
      <div className="glassPanel">
        <div className="header">
          <h2>Welcome Back</h2>
          <p>Login to access the admin dashboard</p>
        </div>
        
        {error && <div className="errorMessage">{error}</div>}

        <form onSubmit={handleLogin} className="form">
          <div className="inputGroup">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              required
            />
          </div>
          
          <div className="inputGroup">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="loginBtn">
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
