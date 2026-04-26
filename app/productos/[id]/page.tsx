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
      <div className="min-h-screen bg-white text-neutral-900">
        <Header />
        <main className="mx-auto max-w-6xl px-6 py-16">
          <h1 className="text-3xl font-medium">Producto no encontrado</h1>
          <p className="mt-4 text-neutral-600">ID recibido: {resolvedParams.id}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Header />

      <main className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-2">
        <div className="overflow-hidden rounded-sm bg-neutral-100">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="h-[620px] w-full object-contain"
          />
        </div>

        <div className="pt-4">
          <p className="text-sm uppercase tracking-wide text-neutral-400">
            Reciclado
          </p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight">
            {producto.nombre}
          </h1>
          <p className="mt-3 text-lg text-neutral-700">
            ${producto.precio.toLocaleString("es-AR")}
          </p>

          <p className="mt-6 max-w-md text-sm leading-7 text-neutral-600">
            {producto.descripcion}
          </p>

          <button className="mt-8 rounded-sm bg-neutral-900 px-6 py-3 text-sm text-white hover:bg-black">
            Agregar al carrito
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}