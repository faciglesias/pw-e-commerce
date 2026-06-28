"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

type Orden = {
  id: number;
  usuario_id: string;
  total: number | string;
  estado: string;
  metodo_pago: string | null;
  referencia_pago: string | null;
  pagado_en: string | null;
  creado_en: string;
};

const estados = [
  "pendiente",
  "pagada",
  "confirmada",
  "enviada",
  "entregada",
  "cancelada",
];

export default function AdminPage() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState<number | null>(null);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    verificarYCargar();
  }, []);

  const verificarYCargar = async () => {
    setLoading(true);
    setError("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/auth/login");
      return;
    }

    const rolRes = await fetch("/api/auth/rol", {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    const rolResult = await rolRes.json();

    if (!rolRes.ok || rolResult.data?.rol !== "admin") {
      setError("No tenés permisos para acceder al panel admin.");
      setLoading(false);
      return;
    }

    await cargarOrdenes(session.access_token);
  };

  const cargarOrdenes = async (token?: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const accessToken = token || session?.access_token;

    if (!accessToken) {
      router.push("/auth/login");
      return;
    }

    const res = await fetch("/api/admin/ordenes", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const result = await res.json();

    if (!res.ok) {
      setError(result.error || "Error al cargar órdenes");
      setOrdenes([]);
    } else {
      setOrdenes(result.data || []);
    }

    setLoading(false);
  };

  const cambiarEstado = async (ordenId: number, nuevoEstado: string) => {
    setActualizando(ordenId);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/auth/login");
        return;
      }

      const res = await fetch("/api/admin/ordenes", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          orden_id: ordenId,
          estado: nuevoEstado,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "Error al actualizar orden");
        return;
      }

      setOrdenes((prev) =>
        prev.map((orden) =>
          orden.id === ordenId ? { ...orden, estado: result.data.estado } : orden
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error al actualizar orden");
    } finally {
      setActualizando(null);
    }
  };

  return (
    <div className="site-wrapper">
      <Header />

      <main className="container section-spacing">
        <p className="breadcrumb">Inicio / Admin</p>

        <h1 className="page-title">Panel admin</h1>

        <p className="page-subtitle">
          Gestión básica de órdenes, pagos y estados del e-commerce.
        </p>

        {loading ? (
          <div className="cart-box">
            <p>Cargando panel admin...</p>
          </div>
        ) : error ? (
          <div className="cart-box">
            <p>{error}</p>

            <div className="cart-buttons">
              <Link href="/" className="button-dark">
                Volver al inicio
              </Link>
            </div>
          </div>
        ) : ordenes.length === 0 ? (
          <div className="cart-box">
            <p>No hay órdenes cargadas todavía.</p>
          </div>
        ) : (
          <div className="admin-table-box">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Orden</th>
                  <th>Usuario</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Pago</th>
                  <th>Fecha</th>
                  <th>Actualizar</th>
                </tr>
              </thead>

              <tbody>
                {ordenes.map((orden) => (
                  <tr key={orden.id}>
                    <td>#{orden.id}</td>

                    <td className="admin-user-cell">
                      {orden.usuario_id.slice(0, 8)}...
                    </td>

                    <td>${Number(orden.total).toLocaleString("es-AR")}</td>

                    <td>
                      <span className={`admin-status status-${orden.estado}`}>
                        {orden.estado}
                      </span>
                    </td>

                    <td>
                      {orden.metodo_pago || "Sin pago"}
                      {orden.referencia_pago && (
                        <span className="admin-payment-ref">
                          Ref: {orden.referencia_pago}
                        </span>
                      )}
                    </td>

                    <td>
                      {new Date(orden.creado_en).toLocaleDateString("es-AR")}
                    </td>

                    <td>
                      <select
                        className="admin-select"
                        value={orden.estado}
                        disabled={actualizando === orden.id}
                        onChange={(e) =>
                          cambiarEstado(orden.id, e.target.value)
                        }
                      >
                        {estados.map((estado) => (
                          <option key={estado} value={estado}>
                            {estado}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}