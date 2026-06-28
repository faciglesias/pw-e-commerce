"use client";

import { Suspense, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

type Orden = {
  id: number;
  total: number | string;
  estado: string;
  metodo_pago: string | null;
  referencia_pago: string | null;
  pagado_en: string | null;
  creado_en: string;
};

function CheckoutContent() {
  const [orden, setOrden] = useState<Orden | null>(null);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const ordenId = searchParams.get("orden");

  useEffect(() => {
    const cargarOrden = async () => {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/auth/login");
        return;
      }

      if (!ordenId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("ordenes")
        .select("*")
        .eq("id", Number(ordenId))
        .single();

      if (error || !data) {
        console.error("Error al cargar orden:", error);
        setOrden(null);
      } else {
        setOrden(data as Orden);
      }

      setLoading(false);
    };

    cargarOrden();
  }, [ordenId, router]);

  const crearPreferencia = async () => {
    if (!orden) return;

    setProcesando(true);
    setMensaje("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/auth/login");
        return;
      }

      const res = await fetch("/api/pagos/crear-preferencia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          orden_id: orden.id,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "Error al preparar el pago");
        return;
      }

      setMensaje(result.data?.mensaje || "Preferencia creada correctamente");
    } catch (err) {
      console.error(err);
      alert("Error al procesar pago");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <main className="container section-spacing">
      <p className="breadcrumb">Inicio / Checkout</p>

      <h1 className="page-title">Checkout</h1>

      <p className="page-subtitle">
        Revisá el resumen de tu orden y prepará el pago de forma segura.
      </p>

      {loading ? (
        <div className="cart-box">
          <p>Cargando checkout...</p>
        </div>
      ) : !orden ? (
        <div className="cart-box">
          <p>No encontramos la orden para pagar.</p>

          <div className="cart-buttons">
            <Link href="/ordenes" className="button-dark">
              Ver órdenes
            </Link>
          </div>
        </div>
      ) : (
        <div className="cart-box">
          <p className="small-label">Resumen de orden</p>

          <h2 className="section-title">Orden #{orden.id}</h2>

          <p className="product-description">
            Estado actual: {orden.estado}
          </p>

          <p className="detail-price">
            Total: ${Number(orden.total).toLocaleString("es-AR")}
          </p>

          <div className="checkout-method">
            <h3 className="product-name">Método de pago</h3>

            <p className="product-description">
              Mercado Pago habilitado. Transferencia bancaria próximamente.
            </p>

            <p className="section-note">
              Tus datos se procesarán de forma segura. En la próxima clase se
              conectará el link real de Mercado Pago.
            </p>
          </div>

          {mensaje && <p className="auth-error">{mensaje}</p>}

          <div className="cart-buttons">
            <button
              className="button-dark"
              onClick={crearPreferencia}
              disabled={procesando || orden.estado !== "pendiente"}
            >
              {procesando ? "Preparando pago..." : "Pagar con Mercado Pago"}
            </button>

            <Link href="/ordenes" className="button-light">
              Volver a órdenes
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <div className="site-wrapper">
      <Header />

      <Suspense
        fallback={
          <main className="container section-spacing">
            <div className="cart-box">
              <p>Cargando checkout...</p>
            </div>
          </main>
        }
      >
        <CheckoutContent />
      </Suspense>

      <Footer />
    </div>
  );
}