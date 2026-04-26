"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CarritoPage() {
  const [cantidad, setCantidad] = useState(0);

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-medium tracking-tight">Carrito</h1>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          Versión básica del carrito con estado local para esta etapa del cuatrimestre.
        </p>

        <div className="mt-8 border border-neutral-200 bg-white p-6">
          <p className="text-base font-medium">Cantidad de productos: {cantidad}</p>

          <div className="mt-5 flex gap-3">
            <button
              onClick={() => setCantidad(cantidad + 1)}
              className="bg-neutral-900 px-5 py-3 text-sm text-white"
            >
              Agregar
            </button>

            <button
              onClick={() => setCantidad(cantidad > 0 ? cantidad - 1 : 0)}
              className="border border-neutral-300 px-5 py-3 text-sm text-neutral-900"
            >
              Quitar
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}