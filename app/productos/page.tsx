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
    <div className="min-h-screen bg-white text-neutral-900">
      <Header />

      <main className="mx-auto max-w-6xl px-6 pt-10 pb-12">
        <p className="text-sm text-neutral-400">Inicio / Catálogo</p>
        <h1 className="mt-4 text-4xl font-medium tracking-tight">Catálogo</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-neutral-600">
          Colección de mochilas y accesorios con estética minimalista.
        </p>

        <div className="mt-8 mb-8">
          <label htmlFor="buscador" className="mb-2 block text-sm text-neutral-600">
            Buscar producto
          </label>
          <input
            id="buscador"
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Escribí el nombre del producto"
            className="w-full max-w-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-900"
          />
        </div>

        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm text-neutral-500">
            {productosFiltrados.length} producto(s)
          </p>
          <p className="text-sm text-neutral-500">Ordenado por relevancia</p>
        </div>

        {productosFiltrados.length > 0 ? (
          <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {productosFiltrados.map((producto) => (
              <ProductCard
                key={producto.id}
                id={producto.id}
                nombre={producto.nombre}
                precio={producto.precio}
                descripcion={producto.descripcion}
                imagen={producto.imagen}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500">
            No se encontraron productos con esa búsqueda.
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}