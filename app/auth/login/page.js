"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="site-wrapper">
      <main className="container auth-container">
        <section className="auth-card">
          <div className="auth-header">
            <p className="small-label">Acceso</p>

            <h1 className="auth-title">Iniciar sesión</h1>

            <p className="auth-subtitle">
              Entrá a tu cuenta para ver tu carrito y continuar tu compra.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-field">
              <label className="auth-label">Email</label>
              <input
                className="auth-input"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Contraseña</label>
              <input
                className="auth-input"
                type="password"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button
              className="button-dark auth-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <p className="auth-footer">
            ¿No tenés cuenta?{" "}
            <Link href="/auth/register">Registrate acá</Link>
          </p>
        </section>
      </main>
    </div>
  );
}