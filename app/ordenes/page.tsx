"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

type Orden = {
  id: number;
  total: number | string;
  estado: string;
  creado_en: string;
};

export default function OrdenesPage() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const cargarOrdenes = async () => {
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/auth/login");
      return;
    }

    const res = await fetch("/api/ordenes", {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.error || "Error al cargar órdenes");
      setOrdenes([]);
    } else {
      setOrdenes(result.data || []);
    }

    setLoading(false);
  };

  return (
    <div className="site-wrapper">
      <Header />

      <main className="container section-spacing">
        <p className="breadcrumb">Inicio / Órdenes</p>

        <h1 className="page-title">Mis órdenes</h1>

        <p className="page-subtitle">
          Historial de compras realizadas en Nómada.
        </p>

        {loading ? (
          <div className="cart-box">
            <p>Cargando órdenes...</p>
          </div>
        ) : ordenes.length === 0 ? (
          <div className="cart-box">
            <p>Todavía no tenés órdenes.</p>

            <div className="cart-buttons">
              <Link href="/productos" className="button-dark">
                Ver productos
              </Link>
            </div>
          </div>
        ) : (
          <div className="cart-box">
            {ordenes.map((orden) => (
              <div key={orden.id} className="cart-item">
                <div>
                  <h2 className="product-name">Orden #{orden.id}</h2>

                  <p className="product-description">
                    Estado: {orden.estado}
                  </p>

                  <p className="product-price">
                    Total: ${Number(orden.total).toLocaleString("es-AR")}
                  </p>

                  <p className="section-note">
                    Fecha:{" "}
                    {new Date(orden.creado_en).toLocaleDateString("es-AR")}
                  </p>
                </div>

                <Link
                  href={`/checkout?orden=${orden.id}`}
                  className="button-light"
                >
                  Pagar orden
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}