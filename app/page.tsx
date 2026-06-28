import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProductos } from "@/lib/productos";

export default async function HomePage() {
  const productos = await getProductos();

  const productoEstrella = productos[0];
  const otrosProductos = productos.slice(1);

  return (
    <div className="site-wrapper">
      <Header />

      <main>
        {productoEstrella && (
          <section className="home-featured container">
            <div className="home-featured-text">
              <p className="small-label">Colección 2026</p>

              <h1 className="home-title">
                Mochilas minimalistas para viajar liviano
              </h1>

              <p className="home-description">
                Una selección de mochilas y accesorios con diseño limpio,
                funcional y urbano, inspirada en una estética simple, sobria y
                pensada para el movimiento diario.
              </p>

              <div className="home-product-info">
                <p className="small-label">Producto estrella</p>

                <h2>{productoEstrella.nombre}</h2>

                <p className="home-price">
                  ${Number(productoEstrella.precio).toLocaleString("es-AR")}
                </p>

                <p className="home-description">
                  {productoEstrella.descripcion}
                </p>
              </div>

              <div className="home-actions">
                <Link
                  href={`/productos/${productoEstrella.id}`}
                  className="button-dark"
                >
                  Ver producto
                </Link>

                <Link href="/productos" className="button-light">
                  Explorar catálogo
                </Link>
              </div>
            </div>

            <Link
              href={`/productos/${productoEstrella.id}`}
              className="home-featured-image-link"
            >
              <div className="home-featured-image-box">
                <img
                  src={productoEstrella.imagen_url || "/mochilas/mochila-360.jpg"}
                  alt={productoEstrella.nombre}
                  className="home-featured-image"
                />

                <div className="home-featured-overlay">
                  <span>Ver producto</span>
                </div>
              </div>
            </Link>
          </section>
        )}

        <section className="catalog-preview container">
          <div className="section-header">
            <div>
              <p className="small-label">Catálogo</p>

              <h2 className="section-title">Explorá nuestro catálogo</h2>

              <p className="section-description">
                Descubrí otros modelos pensados para acompañarte todos los días.
              </p>
            </div>

            <Link href="/productos" className="section-link">
              Ver todos
            </Link>
          </div>

          <div className="product-grid">
            {otrosProductos.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}