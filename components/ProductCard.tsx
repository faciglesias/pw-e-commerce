import Link from "next/link";

type ProductCardProps = {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  imagen: string;
};

export default function ProductCard({
  id,
  nombre,
  precio,
  descripcion,
  imagen,
}: ProductCardProps) {
  return (
    <Link href={`/productos/${id}`} className="product-card-link">
      <article className="product-card">
        <div className="product-image-box">
          <img src={imagen} alt={nombre} className="product-image" />
        </div>

        <div className="product-content">
          <h3 className="product-name">{nombre}</h3>
          <p className="product-price">${precio.toLocaleString("es-AR")}</p>
          <p className="product-description">{descripcion}</p>
          <p className="product-link-text">Ver producto</p>
        </div>
      </article>
    </Link>
  );
}