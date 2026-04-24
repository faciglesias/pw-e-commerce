"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CarritoPage() {
  const [cantidad, setCantidad] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-bold">Carrito</h1>
        <p className="mt-4 text-lg text-gray-700">
          Esta es una versión básica del carrito con estado local.
        </p>

        <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
          <p className="mb-4 text-xl font-semibold">
            Cantidad de productos: {cantidad}
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => setCantidad(cantidad + 1)}
              className="rounded-lg bg-black px-4 py-2 text-white"
            >
              Agregar
            </button>

            <button
              onClick={() => setCantidad(cantidad > 0 ? cantidad - 1 : 0)}
              className="rounded-lg border px-4 py-2"
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