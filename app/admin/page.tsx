"use client";

import { useCallback, useEffect, useState } from "react";
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

  const cargarOrdenes = useCallback(
    async (token?: string) => {
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
        setOrdenes((result.data as Orden[]) || []);
      }

      setLoading(false);
    },
    [router]
  );

  const verificarYCargar = useCallback(async () => {
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
  }, [router, cargarOrdenes]);

  useEffect(() => {
    verificarYCargar();
  }, [verificarYCargar]);

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
          orden.id === ordenId
            ? { ...orden, estado: result.data.estado }
            : orden
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
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <section className="mx-auto max-w-6xl">
          <div className="mb-6 text-sm text-gray-500">
            <Link href="/" className="hover:underline">
              Inicio
            </Link>{" "}
            / Admin
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Panel admin</h1>
            <p className="mt-2 text-gray-600">
              Gestión básica de órdenes, pagos y estados del e-commerce.
            </p>
          </div>

          {loading ? (
            <div className="rounded-xl bg-white p-6 shadow">
              <p className="text-gray-600">Cargando panel admin...</p>
            </div>
          ) : error ? (
            <div className="rounded-xl bg-white p-6 shadow">
              <p className="mb-4 text-red-600">{error}</p>

              <Link
                href="/"
                className="inline-block rounded-lg bg-black px-5 py-2 text-white transition hover:bg-gray-800"
              >
                Volver al inicio
              </Link>
            </div>
          ) : ordenes.length === 0 ? (
            <div className="rounded-xl bg-white p-6 shadow">
              <p className="text-gray-600">
                No hay órdenes cargadas todavía.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl bg-white shadow">
              <table className="w-full min-w-[900px] border-collapse text-left">
                <thead className="border-b bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                      Orden
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                      Usuario
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                      Total
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                      Pago
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                      Actualizar
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {ordenes.map((orden) => (
                    <tr key={orden.id} className="border-b last:border-b-0">
                      <td className="px-4 py-3 text-sm text-gray-800">
                        #{orden.id}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-800">
                        {orden.usuario_id.slice(0, 8)}...
                      </td>

                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        ${Number(orden.total).toLocaleString("es-AR")}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-800">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
                          {orden.estado}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-800">
                        <div>{orden.metodo_pago || "Sin pago"}</div>

                        {orden.referencia_pago && (
                          <div className="mt-1 text-xs text-gray-500">
                            Ref: {orden.referencia_pago}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-800">
                        {new Date(orden.creado_en).toLocaleDateString("es-AR")}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-800">
                        <select
                          value={orden.estado}
                          disabled={actualizando === orden.id}
                          onChange={(e) =>
                            cambiarEstado(orden.id, e.target.value)
                          }
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
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
        </section>
      </main>

      <Footer />
    </>
  );
}