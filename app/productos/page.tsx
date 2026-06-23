import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProductos } from "@/lib/productos";

export default async function ProductosPage() {
  const productos = await getProductos();

  return (
    <div className="site-wrapper">
      <Header />

      <main className="container section-spacing">
        <p className="breadcrumb">Inicio / Productos</p>

        <h1 className="page-title">Productos</h1>

        <p className="page-subtitle">
          Mochilas y accesorios pensados para moverte liviano, con diseño simple
          y funcional.
        </p>

        <div className="products-topbar">
          <p className="section-note">
            {productos.length} productos disponibles
          </p>
        </div>

        <section className="products-grid">
          {productos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}