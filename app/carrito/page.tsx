"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CarritoPage() {
  const [cantidad, setCantidad] = useState(0);

  return (
    <div className="site-wrapper">
      <Header />

      <main className="container section-spacing">
        <h1 className="page-title">Carrito</h1>
        <p className="page-subtitle">
          Versión básica del carrito con estado local para esta etapa del proyecto.
        </p>

        <div className="cart-box">
          <p className="product-name">Cantidad de productos: {cantidad}</p>

          <div className="cart-buttons">
            <button
              onClick={() => setCantidad(cantidad + 1)}
              className="button-dark"
            >
              Agregar
            </button>

            <button
              onClick={() => setCantidad(cantidad > 0 ? cantidad - 1 : 0)}
              className="button-light"
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