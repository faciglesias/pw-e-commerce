import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgregarAlCarrito from "@/components/AgregarAlCarrito";
import { getProductoPorId } from "@/lib/productos";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductoDetallePage({ params }: Props) {
  const { id } = await params;

  const producto = await getProductoPorId(id);

  if (!producto) {
    notFound();
  }

  const imagenProducto = producto.imagen_url || "/mochilas/mochila-360.jpg";

  return (
    <div className="site-wrapper">
      <Header />

      <main className="detalle-producto-main">
        <p className="detalle-breadcrumb">
          Inicio / Productos / {producto.nombre}
        </p>

        <section className="detalle-producto-grid">
          <div>
            <input
              type="checkbox"
              id="zoom-producto"
              className="zoom-checkbox"
            />

            <label htmlFor="zoom-producto" className="detalle-imagen-card">
              <img
                src={imagenProducto}
                alt={producto.nombre}
                className="detalle-imagen-producto"
              />

              <span className="detalle-imagen-overlay">
                <span className="detalle-imagen-overlay-text">
                  Ampliar imagen
                </span>
              </span>
            </label>

            <label htmlFor="zoom-producto" className="zoom-modal">
              <span className="zoom-cerrar">×</span>

              <img
                src={imagenProducto}
                alt={producto.nombre}
                className="zoom-imagen"
              />
            </label>
          </div>

          <div className="detalle-info-card">
            {producto.categoria && (
              <p className="detalle-categoria">{producto.categoria}</p>
            )}

            <h1 className="detalle-nombre">{producto.nombre}</h1>

            <p className="detalle-precio">
              ${Number(producto.precio).toLocaleString("es-AR")}
            </p>

            <p className="detalle-descripcion">{producto.descripcion}</p>

            <div className="detalle-stock">
              <p>
                <strong>Stock disponible:</strong> {producto.stock}
              </p>
            </div>

            <div className="detalle-botones">
              <AgregarAlCarrito producto={producto} />

              <Link href="/productos" className="button-light">
                Volver a productos
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style>
        {`
          .detalle-producto-main {
            width: min(1080px, calc(100% - 48px));
            margin: 0 auto;
            padding: 64px 0 90px;
          }

          .detalle-breadcrumb {
            margin: 0 0 32px;
            color: #8b8982;
            font-size: 0.95rem;
          }

          .detalle-producto-grid {
            display: grid;
            grid-template-columns: 420px 1fr;
            gap: 64px;
            align-items: center;
          }

          .zoom-checkbox {
            display: none;
          }

          .detalle-imagen-card {
            width: 420px;
            height: 460px;
            background: #ffffff;
            border: 1px solid #e2e0da;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;
            cursor: zoom-in;
            transition: transform 0.25s ease, box-shadow 0.25s ease;
          }

          .detalle-imagen-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 45px rgba(0, 0, 0, 0.12);
          }

          .detalle-imagen-producto {
            width: 78%;
            height: 78%;
            object-fit: contain;
            transition: transform 0.3s ease;
          }

          .detalle-imagen-card:hover .detalle-imagen-producto {
            transform: scale(1.06);
          }

          .detalle-imagen-overlay {
            position: absolute;
            inset: 0;
            background: rgba(17, 17, 17, 0.28);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.25s ease;
          }

          .detalle-imagen-card:hover .detalle-imagen-overlay {
            opacity: 1;
          }

          .detalle-imagen-overlay-text {
            background: #ffffff;
            color: #111111;
            padding: 14px 24px;
            font-size: 0.95rem;
            font-weight: 700;
            transform: translateY(10px);
            transition: transform 0.25s ease;
          }

          .detalle-imagen-card:hover .detalle-imagen-overlay-text {
            transform: translateY(0);
          }

          .zoom-modal {
            position: fixed;
            inset: 0;
            background: rgba(17, 17, 17, 0.82);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            cursor: zoom-out;
            padding: 32px;
          }

          .zoom-checkbox:checked ~ .zoom-modal {
            display: flex;
          }

          .zoom-imagen {
            max-width: min(860px, 92vw);
            max-height: 86vh;
            object-fit: contain;
            background: #ffffff;
            padding: 32px;
            box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
          }

          .zoom-cerrar {
            position: fixed;
            top: 24px;
            right: 32px;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: #ffffff;
            color: #111111;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            line-height: 1;
            font-weight: 400;
          }

          .detalle-info-card {
            max-width: 520px;
          }

          .detalle-categoria {
            margin: 0 0 12px;
            color: #8b8982;
            font-size: 0.78rem;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            font-weight: 700;
          }

          .detalle-nombre {
            margin: 0 0 22px;
            font-size: clamp(2.8rem, 4vw, 4.5rem);
            line-height: 0.95;
            letter-spacing: -0.07em;
            font-weight: 800;
          }

          .detalle-precio {
            margin: 0 0 28px;
            font-size: 2rem;
            font-weight: 700;
            letter-spacing: -0.04em;
          }

          .detalle-descripcion {
            margin: 0;
            color: #4d4b46;
            font-size: 1.05rem;
            line-height: 1.75;
          }

          .detalle-stock {
            margin-top: 28px;
            padding-top: 22px;
            border-top: 1px solid #d8d6d0;
            color: #4d4b46;
            font-size: 0.98rem;
          }

          .detalle-stock p {
            margin: 0;
          }

          .detalle-botones {
            display: flex;
            align-items: center;
            gap: 14px;
            margin-top: 32px;
          }

          @media (max-width: 900px) {
            .detalle-producto-main {
              width: min(100% - 32px, 1080px);
              padding: 48px 0 80px;
            }

            .detalle-producto-grid {
              grid-template-columns: 1fr;
              gap: 36px;
            }

            .detalle-imagen-card {
              width: 100%;
              height: 420px;
            }

            .detalle-info-card {
              max-width: none;
            }

            .detalle-botones {
              flex-direction: column;
              align-items: flex-start;
            }

            .zoom-imagen {
              padding: 20px;
            }
          }
        `}
      </style>
    </div>
  );
}