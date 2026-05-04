import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { productos } from "@/data/productos";

export default function Home() {
  const destacados = [productos[1], productos[2]];

  return (
    <div className="site-wrapper">
      <Header />

      <main>
        <section className="container section-spacing hero-grid">
          <div className="hero-text">
            <p className="small-label">Colección 2026</p>

            <h1 className="page-title">Mochilas minimalistas para viajar liviano</h1>

            <p className="hero-description">
              Una selección de mochilas y accesorios con diseño limpio,
              funcional y urbano, inspirada en una estética simple, sobria y
              pensada para el movimiento diario.
            </p>

            <div className="hero-buttons">
              <Link href="/productos" className="button-dark">
                Ver colección
              </Link>

              <Link href="/carrito" className="button-light">
                Ir al carrito
              </Link>
            </div>
          </div>

          <Link href="/productos/1" className="hero-image-link">
            <img
              src="/mochilas/mochila-360.jpg"
              alt="Mochila 360"
              className="hero-image"
            />
          </Link>
        </section>

        <section className="container section-spacing">
          <div className="section-header">
            <div>
              <p className="small-label">Destacados</p>
              <h2 className="section-title">Nuestros elegidos</h2>
            </div>

            <Link href="/productos" className="link-inline">
              Ver todos
            </Link>
          </div>

          <div className="products-grid-two">
            {destacados.map((producto) => (
              <ProductCard key={producto.id} {...producto} />
            ))}
          </div>
        </section>

        <section className="quote-section">
          <div className="container">
            <p className="quote-text">
              Diseñadas para acompañarte todos los días, con una estética
              simple, materiales resistentes y una forma de llevar solo lo
              necesario.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}