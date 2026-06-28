"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

function PagoCompletadoContent() {
  const searchParams = useSearchParams();

  const paymentId = searchParams.get("payment_id");
  const externalReference = searchParams.get("external_reference");
  const status = searchParams.get("status");

  return (
    <main className="container section-spacing">
      <p className="breadcrumb">Inicio / Pago completado</p>

      <div className="cart-box payment-result payment-success">
        <p className="small-label">Pago aprobado</p>

        <h1 className="page-title">Pago completado</h1>

        <p className="page-subtitle">
          Tu pago fue procesado correctamente en Mercado Pago.
        </p>

        <div className="checkout-method">
          <p className="product-description">
            Estado: {status || "approved"}
          </p>

          {paymentId && (
            <p className="product-description">
              ID de pago: {paymentId}
            </p>
          )}

          {externalReference && (
            <p className="product-description">
              Orden relacionada: #{externalReference}
            </p>
          )}

          <p className="section-note">
            En esta clase el pago se confirma visualmente. La actualización
            automática de la orden por webhook se completa en la próxima etapa.
          </p>
        </div>

        <div className="cart-buttons">
          <Link href="/ordenes" className="button-dark">
            Ver mis órdenes
          </Link>

          <Link href="/productos" className="button-light">
            Seguir comprando
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function PagoCompletadoPage() {
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
        <PagoCompletadoContent />
      </Suspense>

      <Footer />
    </div>
  );
}