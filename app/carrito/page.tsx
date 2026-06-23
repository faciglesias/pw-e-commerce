"use client";

import { useEffect, useState } from "react";
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
  const router = useRouter();

  useEffect(() => {
    cargarCarrito();
  }, []);

  const cargarCarrito = async () => {
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
      .select(`
        id,
        cantidad,
        productos (
          id,
          nombre,
          descripcion,
          precio,
          imagen_url
        )
      `)
      .order("id", { ascending: true });

    if (error) {
      console.error("Error al cargar carrito:", error);
      setItems([]);
    } else {
      setItems((data as unknown as ItemCarrito[]) || []);
    }

    setLoading(false);
  };

  const eliminarDelCarrito = async (id: number) => {
    const { error } = await supabase.from("carrito").delete().eq("id", id);

    if (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar producto");
      return;
    }

    setItems(items.filter((item) => item.id !== id));
  };

  const total = items.reduce((acc, item) => {
    if (!item.productos) return acc;

    return acc + Number(item.productos.precio) * item.cantidad;
  }, 0);

  return (
    <div className="site-wrapper">
      <Header />

      <main className="container section-spacing">
        <p className="breadcrumb">Inicio / Carrito</p>

        <h1 className="page-title">Mi carrito</h1>

        <p className="page-subtitle">
          Estos son los productos que agregaste a tu carrito.
        </p>

        {loading ? (
          <div className="cart-box">
            <p>Cargando carrito...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="cart-box">
            <p>Tu carrito está vacío.</p>

            <div className="cart-buttons">
              <Link href="/productos" className="button-dark">
                Ver productos
              </Link>
            </div>
          </div>
        ) : (
          <div className="cart-box">
            {items.map((item) => {
              if (!item.productos) return null;

              return (
                <div key={item.id} className="cart-item">
                  <div>
                    <h2 className="product-name">{item.productos.nombre}</h2>

                    <p className="product-description">
                      {item.productos.descripcion}
                    </p>

                    <p className="product-price">
                      Cantidad: {item.cantidad} · $
                      {Number(item.productos.precio).toLocaleString("es-AR")}
                    </p>
                  </div>

                  <button
                    className="button-light"
                    onClick={() => eliminarDelCarrito(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              );
            })}

            <div className="cart-total">
              <h2>Total: ${total.toLocaleString("es-AR")}</h2>
            </div>

            <div className="cart-buttons">
              <Link href="/productos" className="button-light">
                Seguir comprando
              </Link>

              <button className="button-dark">Finalizar compra</button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}