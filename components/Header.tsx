import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold">
          PW E-Commerce
        </Link>

        <nav aria-label="Navegación principal">
          <ul className="flex gap-6 text-sm font-medium">
            <li>
              <Link href="/">Inicio</Link>
            </li>
            <li>
              <Link href="/productos">Productos</Link>
            </li>
            <li>
              <Link href="/carrito">Carrito</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}