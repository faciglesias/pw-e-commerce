import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProductoPorId } from "@/lib/productos";
import AgregarAlCarrito from "@/components/AgregarAlCarrito";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductoDetallePage({ params }: PageProps) {
  const { id } = await params;
  const producto = await getProductoPorId(id);

  if (!producto) {
    notFound();
  }

  return (
    <div className="site-wrapper">
      <Header />

      <main className="container">
        <section className="detail-grid">
          <div className="detail-image-box">
            <img
              src={producto.imagen_url}
              alt={producto.nombre}
              className="detail-image"
            />
          </div>

          <div className="detail-content">
            <p className="breadcrumb">
              <Link href="/">Inicio</Link> /{" "}
              <Link href="/productos">Productos</Link> / {producto.nombre}
            </p>

            <p className="detail-tag">{producto.categoria}</p>

            <h1 className="detail-title">{producto.nombre}</h1>

            <p className="detail-price">${producto.precio}</p>

            <p className="detail-description">{producto.descripcion}</p>

            <div className="cart-buttons">
              <AgregarAlCarrito producto={producto} />

              <Link href="/productos" className="button-light">
                Volver a productos
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}