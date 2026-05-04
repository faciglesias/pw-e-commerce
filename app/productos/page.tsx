"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { productos } from "@/data/productos";

export default function ProductosPage() {
  const [busqueda, setBusqueda] = useState("");

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="site-wrapper">
      <Header />

      <main className="container section-spacing">
        <p className="breadcrumb">Inicio / Catálogo</p>
        <h1 className="page-title">Catálogo</h1>
        <p className="page-subtitle">
          Colección de mochilas y accesorios con estética minimalista.
        </p>

        <div className="search-block">
          <label htmlFor="buscador" className="search-label">
            Buscar producto
          </label>
          <input
            id="buscador"
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Escribí el nombre del producto"
            className="search-input"
          />
        </div>

        <div className="products-topbar">
          <p className="section-note">{productosFiltrados.length} producto(s)</p>
          <p className="section-note">Ordenado por relevancia</p>
        </div>

        {productosFiltrados.length > 0 ? (
          <div className="products-grid">
            {productosFiltrados.map((producto) => (
              <ProductCard key={producto.id} {...producto} />
            ))}
          </div>
        ) : (
          <p className="section-note">
            No se encontraron productos con esa búsqueda.
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}