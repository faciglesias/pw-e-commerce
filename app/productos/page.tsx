import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { productos } from "@/data/productos";

export default function ProductosPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="mb-8 text-4xl font-bold">Catálogo de productos</h1>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {productos.map((producto) => (
            <ProductCard key={producto.id} {...producto} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}