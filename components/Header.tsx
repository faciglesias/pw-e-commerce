import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-container">
        <Link href="/" className="brand-link">
          Nómada
        </Link>

        <nav className="main-nav">
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

            <li>
              <Link href="/ordenes">Órdenes</Link>
            </li>

            <li>
              <Link href="/admin">Admin</Link>
            </li>

            <li>
              <Link href="/auth/login">Iniciar sesión</Link>
            </li>

            <li>
              <Link href="/auth/register">Crear cuenta</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}