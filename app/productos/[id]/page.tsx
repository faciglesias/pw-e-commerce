import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { productos } from "@/data/productos";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductoDetalle({ params }: Props) {
  const resolvedParams = await params;
  const idNumero = Number(resolvedParams.id);

  const producto = productos.find((p) => p.id === idNumero);

  if (!producto) {
    return (
      <div className="site-wrapper">
        <Header />
        <main className="container section-spacing">
          <h1 className="page-title">Producto no encontrado</h1>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="site-wrapper">
      <Header />

      <main className="container detail-grid">
        <div className="detail-image-box">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="detail-image"
          />
        </div>

        <div className="detail-content">
          <p className="detail-tag">Colección Nómada</p>
          <h1 className="detail-title">{producto.nombre}</h1>
          <p className="detail-price">${producto.precio.toLocaleString("es-AR")}</p>

          <p className="detail-description">{producto.descripcion}</p>

          <button className="button-dark" style={{ marginTop: "32px" }}>
            Agregar al carrito
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}