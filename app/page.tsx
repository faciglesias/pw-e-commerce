import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { productos } from "@/data/productos";

export default function Home() {
  const destacados = [productos[1], productos[2]];

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Header />

      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-6 py-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-400">
              Colección 2026
            </p>

            <h1 className="mt-4 text-5xl font-medium tracking-tight">
              Mochilas minimalistas para viajar liviano
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-7 text-neutral-600">
              Una selección de mochilas y accesorios con diseño limpio,
              funcional y urbano, inspirada en una estética simple, sobria y
              pensada para el movimiento diario.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                href="/productos"
                className="bg-neutral-900 px-6 py-3 text-sm text-white hover:bg-black"
              >
                Ver colección
              </Link>

              <Link
                href="/carrito"
                className="border border-neutral-300 px-6 py-3 text-sm text-neutral-900"
              >
                Ir al carrito
              </Link>
            </div>
          </div>

          <Link
            href="/productos/1"
            className="block overflow-hidden rounded-sm bg-neutral-100"
          >
            <img
              src="/mochilas/mochila-360.jpg"
              alt="Mochila 360"
              className="h-[520px] w-full object-contain transition duration-300 hover:scale-[1.02]"
            />
          </Link>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-neutral-400">
                Destacados
              </p>
              <h2 className="mt-2 text-3xl font-medium tracking-tight">
                Nuestros elegidos
              </h2>
            </div>

            <Link
              href="/productos"
              className="text-sm text-neutral-700 underline-offset-4 hover:underline"
            >
              Ver todos
            </Link>
          </div>

          <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
            {destacados.map((producto) => (
              <ProductCard key={producto.id} {...producto} />
            ))}
          </div>
        </section>

        <section className="border-t border-neutral-200">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <p className="max-w-3xl text-2xl font-medium leading-10 text-neutral-900">
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