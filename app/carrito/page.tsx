"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

type ProductoCarrito = {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number | string;
  imagen_url: string | null;
};

type ItemCarrito = {
  id: number;
  cantidad: number;
  productos: ProductoCarrito | null;
};

export default function CarritoPage() {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);

  const router = useRouter();

  const cargarCarrito = useCallback(async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    const { data, error } = await supabase
      .from("carrito")
      .select(
        `
        id,
        cantidad,
        productos (
          id,
          nombre,
          descripcion,
          precio,
          imagen_url
        )
      `
      )
      .order("id", { ascending: true });

    if (error) {
      console.error("Error al cargar carrito:", error);
      setItems([]);
    } else {
      setItems((data as unknown as ItemCarrito[]) || []);
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    cargarCarrito();
  }, [cargarCarrito]);

  const eliminarDelCarrito = async (id: number) => {
    const { error } = await supabase.from("carrito").delete().eq("id", id);

    if (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar producto");
      return;
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const finalizarCompra = async () => {
    setProcesando(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/auth/login");
        return;
      }

      const res = await fetch("/api/ordenes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "Error al crear orden");
        return;
      }

      alert("Compra realizada correctamente");
      setItems([]);
      router.push("/ordenes");
    } catch (err) {
      console.error(err);
      alert("Error al finalizar compra");
    } finally {
      setProcesando(false);
    }
  };

  const total = items.reduce((acc, item) => {
    if (!item.productos) return acc;
    return acc + Number(item.productos.precio) * item.cantidad;
  }, 0);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <section className="mx-auto max-w-5xl">
          <div className="mb-6 text-sm text-gray-500">
            <Link href="/" className="hover:underline">
              Inicio
            </Link>{" "}
            / Carrito
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mi carrito</h1>
            <p className="mt-2 text-gray-600">
              Estos son los productos que agregaste a tu carrito.
            </p>
          </div>

          {loading ? (
            <div className="rounded-xl bg-white p-6 shadow">
              <p className="text-gray-600">Cargando carrito...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-xl bg-white p-6 text-center shadow">
              <p className="mb-4 text-gray-600">Tu carrito está vacío.</p>

              <Link
                href="/productos"
                className="inline-block rounded-lg bg-black px-5 py-2 text-white transition hover:bg-gray-800"
              >
                Ver productos
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <div className="space-y-4">
                {items.map((item) => {
                  if (!item.productos) return null;

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow sm:flex-row"
                    >
                      {item.productos.imagen_url && (
                        <img
                          src={item.productos.imagen_url}
                          alt={item.productos.nombre}
                          className="h-32 w-full rounded-lg object-cover sm:w-32"
                        />
                      )}

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">
                            {item.productos.nombre}
                          </h2>

                          {item.productos.descripcion && (
                            <p className="mt-1 text-sm text-gray-600">
                              {item.productos.descripcion}
                            </p>
                          )}

                          <p className="mt-3 text-gray-700">
                            Cantidad: {item.cantidad} · ${" "}
                            {Number(item.productos.precio).toLocaleString(
                              "es-AR"
                            )}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => eliminarDelCarrito(item.id)}
                          className="mt-4 w-fit rounded-lg border border-red-500 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <aside className="h-fit rounded-xl bg-white p-6 shadow">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Resumen
                </h2>

                <div className="mb-6 flex items-center justify-between border-b pb-4">
                  <span className="text-gray-600">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${total.toLocaleString("es-AR")}
                  </span>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/productos"
                    className="block rounded-lg border border-gray-300 px-5 py-3 text-center text-gray-700 transition hover:bg-gray-100"
                  >
                    Seguir comprando
                  </Link>

                  <button
                    type="button"
                    onClick={finalizarCompra}
                    disabled={procesando}
                    className="w-full rounded-lg bg-black px-5 py-3 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {procesando ? "Procesando..." : "Finalizar compra"}
                  </button>
                </div>
              </aside>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}