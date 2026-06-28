"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Header() {
  const [logueado, setLogueado] = useState(false);
  const [rol, setRol] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    cargarSesion();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      cargarSesion();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const cargarSesion = async () => {
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setLogueado(false);
      setRol(null);
      setLoading(false);
      return;
    }

    setLogueado(true);

    try {
      const res = await fetch("/api/auth/rol", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        setRol(result.data?.rol || "cliente");
      } else {
        setRol("cliente");
      }
    } catch (err) {
      console.error("Error al obtener rol:", err);
      setRol("cliente");
    }

    setLoading(false);
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();

    setLogueado(false);
    setRol(null);

    router.push("/");
    router.refresh();
  };

  return (
    <header className="site-header">
      <div className="header-container">
        <Link href="/" className="brand-link">
          Nómada
        </Link>

        <nav className="main-nav">
          <ul>
            <li>
              <Link href="/">Inicio</Link>
            </li>

            <li>
              <Link href="/productos">Catálogo</Link>
            </li>

            <li>
              <Link href="/carrito">Carrito</Link>
            </li>

            {logueado && (
              <li>
                <Link href="/ordenes">Órdenes</Link>
              </li>
            )}

            {logueado && rol === "admin" && (
              <li>
                <Link href="/admin">Admin</Link>
              </li>
            )}

            {!loading && !logueado && (
              <>
                <li>
                  <Link href="/auth/login">Iniciar sesión</Link>
                </li>

                <li>
                  <Link href="/auth/register">Crear cuenta</Link>
                </li>
              </>
            )}

            {logueado && (
              <li>
                <button className="nav-logout-button" onClick={cerrarSesion}>
                  Cerrar sesión
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}