import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProductos } from "@/lib/productos";

export default async function ProductosPage() {
  const productos = await getProductos();

  return (
    <div className="site-wrapper">
      <Header />

      <main className="container page-section">
        <p className="breadcrumb">Inicio / Catálogo</p>

        <div className="page-heading">
          <p className="small-label">Catálogo</p>

          <h1 className="page-title">Productos</h1>

          <p className="products-count">
            {productos.length} productos disponibles
          </p>
        </div>

        <div className="product-grid catalog-grid">
          {productos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}