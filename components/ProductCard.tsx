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
    <Link href={`/productos/${id}`} className="block group">
      <article className="bg-white">
        <div className="overflow-hidden rounded-sm bg-neutral-100">
          <img
            src={imagen}
            alt={nombre}
            className="h-[420px] w-full object-contain transition duration-300 group-hover:scale-[1.02]"
          />
        </div>

        <div className="pt-4">
          <h3 className="text-base font-medium text-neutral-900">{nombre}</h3>
          <p className="mt-1 text-sm text-neutral-500">
            ${precio.toLocaleString("es-AR")}
          </p>
          <p className="mt-3 text-sm leading-6 text-neutral-600">{descripcion}</p>

          <p className="mt-4 inline-block text-sm font-medium text-neutral-900 underline-offset-4 group-hover:underline">
            Ver producto
          </p>
        </div>
      </article>
    </Link>
  );
}