import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-container">
        <Link href="/" className="brand-link">
          Nómada
        </Link>

        <nav className="main-nav" aria-label="Navegación principal">
          <ul>
            <li>
              <Link href="/">Inicio</Link>
            </li>
            <li>
              <Link href="/productos">Catálogo</Link>
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