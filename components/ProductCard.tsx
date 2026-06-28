import Link from "next/link";

type Producto = {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number | string;
  imagen_url: string | null;
  categoria?: string | null;
};

export default function ProductCard({ producto }: { producto: Producto }) {
  const precioFormateado = Number(producto.precio).toLocaleString("es-AR");

  return (
    <Link href={`/productos/${producto.id}`} className="product-card-link">
      <article className="product-card">
        <div className="product-image-box">
          <img
            src={producto.imagen_url || "/mochilas/mochila-360.jpg"}
            alt={producto.nombre}
            className="product-image"
          />
        </div>

        <div className="product-content">
          {producto.categoria && (
            <p className="product-category">{producto.categoria}</p>
          )}

          <h2 className="product-name">{producto.nombre}</h2>

          <p className="product-price">${precioFormateado}</p>

          <p className="product-description">{producto.descripcion}</p>

          <span className="product-link-button">Ver producto</span>
        </div>
      </article>
    </Link>
  );
}