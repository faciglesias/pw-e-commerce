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
    <article className="overflow-hidden rounded-xl border bg-white p-4 shadow-sm">
      <img
        src={imagen}
        alt={nombre}
        className="h-64 w-full rounded-lg object-cover"
      />

      <h3 className="mt-4 text-xl font-semibold">{nombre}</h3>
      <p className="mt-2 text-lg font-bold text-blue-600">
        ${precio.toLocaleString("es-AR")}
      </p>
      <p className="mt-2 text-sm text-gray-600">{descripcion}</p>

      <Link
        href={`/productos/${id}`}
        className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-white"
      >
        Ver detalle
      </Link>
    </article>
  );
}