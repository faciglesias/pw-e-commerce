"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Completá email y contraseña.");
      setLoading(false);
      return;
    }

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError("Email o contraseña incorrectos.");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Error inesperado al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="site-wrapper">
      <Header />

      <main className="container section-spacing">
        <p className="breadcrumb">Inicio / Iniciar sesión</p>

        <div className="auth-card">
          <h1 className="page-title">Iniciar sesión</h1>

          <p className="page-subtitle">
            Entrá a tu cuenta para ver tu carrito, tus órdenes y continuar tu
            compra.
          </p>

          <form className="auth-form" onSubmit={handleLogin}>
            <label className="auth-label" htmlFor="email">
              Email
            </label>

            <input
              id="email"
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
            />

            <label className="auth-label" htmlFor="password">
              Contraseña
            </label>

            <input
              id="password"
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
            />

            {error && <p className="auth-error">{error}</p>}

            <button className="button-dark" type="submit" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <p className="auth-footer-text">
            ¿No tenés cuenta?{" "}
            <Link href="/auth/register">Crear cuenta</Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}