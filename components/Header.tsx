import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-3xl font-semibold tracking-wide text-neutral-900">
          Nómada
        </Link>

        <nav aria-label="Navegación principal">
          <ul className="flex gap-6 text-sm text-neutral-700">
            <li>
              <Link href="/" className="hover:text-black">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/productos" className="hover:text-black">
                Catálogo
              </Link>
            </li>
            <li>
              <Link href="/carrito" className="hover:text-black">
                Carrito
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}