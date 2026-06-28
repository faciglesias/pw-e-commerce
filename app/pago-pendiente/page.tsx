"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

function PagoPendienteContent() {
  const searchParams = useSearchParams();

  const paymentId = searchParams.get("payment_id");
  const externalReference = searchParams.get("external_reference");
  const status = searchParams.get("status");

  return (
    <main className="container section-spacing">
      <p className="breadcrumb">Inicio / Pago pendiente</p>

      <div className="cart-box payment-result payment-pending">
        <p className="small-label">Pago pendiente</p>

        <h1 className="page-title">Tu pago está pendiente</h1>

        <p className="page-subtitle">
          Mercado Pago está procesando la operación. Algunas formas de pago
          pueden tardar en confirmarse.
        </p>

        <div className="checkout-method">
          <p className="product-description">
            Estado: {status || "pending"}
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
            Cuando el pago se confirme, el estado de la orden podrá actualizarse.
            La actualización automática por webhook se completa en la próxima
            etapa.
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

export default function PagoPendientePage() {
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
        <PagoPendienteContent />
      </Suspense>

      <Footer />
    </div>
  );
}