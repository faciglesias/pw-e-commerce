"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMensaje("");
    setError("");

    if (!nombre.trim() || !email.trim() || !password.trim()) {
      setError("Completá todos los campos.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("No se pudo crear el usuario.");
        setLoading(false);
        return;
      }

      const { error: perfilError } = await supabase.from("usuarios").upsert({
        id: data.user.id,
        email,
        nombre,
        rol: "cliente",
      });

      if (perfilError) {
        console.error("Error al crear perfil:", perfilError);
        setError("La cuenta se creó, pero hubo un error al crear el perfil.");
        setLoading(false);
        return;
      }

      setMensaje("Cuenta creada correctamente. Ya podés iniciar sesión.");

      setTimeout(() => {
        router.push("/auth/login");
      }, 1200);
    } catch (err) {
      console.error(err);
      setError("Error inesperado al crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="site-wrapper">
      <Header />

      <main className="container section-spacing">
        <p className="breadcrumb">Inicio / Crear cuenta</p>

        <div className="auth-card">
          <h1 className="page-title">Crear cuenta</h1>

          <p className="page-subtitle">
            Registrate para comprar, guardar tu carrito y ver tus órdenes.
          </p>

          <form className="auth-form" onSubmit={handleRegister}>
            <label className="auth-label" htmlFor="nombre">
              Nombre
            </label>

            <input
              id="nombre"
              className="auth-input"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
            />

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
              placeholder="Mínimo 6 caracteres"
            />

            {error && <p className="auth-error">{error}</p>}

            {mensaje && <p className="auth-success">{mensaje}</p>}

            <button className="button-dark" type="submit" disabled={loading}>
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <p className="auth-footer-text">
            ¿Ya tenés cuenta?{" "}
            <Link href="/auth/login">Iniciar sesión</Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}