"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

function PagoFallidoContent() {
  const searchParams = useSearchParams();

  const externalReference = searchParams.get("external_reference");
  const status = searchParams.get("status");

  return (
    <main className="container section-spacing">
      <p className="breadcrumb">Inicio / Pago fallido</p>

      <div className="cart-box payment-result payment-failure">
        <p className="small-label">Pago rechazado</p>

        <h1 className="page-title">No pudimos procesar tu pago</h1>

        <p className="page-subtitle">
          Mercado Pago informó que el pago fue rechazado o cancelado.
        </p>

        <div className="checkout-method">
          <p className="product-description">
            Estado: {status || "rechazado"}
          </p>

          {externalReference && (
            <p className="product-description">
              Orden relacionada: #{externalReference}
            </p>
          )}

          <p className="section-note">
            Posibles razones: tarjeta rechazada, fondos insuficientes,
            datos incorrectos o cancelación del pago.
          </p>
        </div>

        <div className="cart-buttons">
          {externalReference ? (
            <Link
              href={`/checkout?orden=${externalReference}`}
              className="button-dark"
            >
              Reintentar pago
            </Link>
          ) : (
            <Link href="/ordenes" className="button-dark">
              Volver a órdenes
            </Link>
          )}

          <Link href="/productos" className="button-light">
            Seguir comprando
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function PagoFallidoPage() {
  return (
    <div className="site-wrapper">
      <Header />

      <Suspense
        fallback={
          <main className="container section-spacing">
            <div className="cart-box">
              <p>Cargando resultado del pago...</p>
            </div>
          </main>
        }
      >
        <PagoFallidoContent />
      </Suspense>

      <Footer />
    </div>
  );
}