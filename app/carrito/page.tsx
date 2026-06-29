"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

type ProductoCarrito = {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number | string;
  imagen_url: string | null;
};

type ItemCarrito = {
  id: number;
  cantidad: number;
  productos: ProductoCarrito | null;
};

export default function CarritoPage() {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);

  const router = useRouter();

  const cargarCarrito = useCallback(async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    const { data, error } = await supabase
      .from("carrito")
      .select(
        `
        id,
        cantidad,
        productos (
          id,
          nombre,
          descripcion,
          precio,
          imagen_url
        )
      `
      )
      .order("id", { ascending: true });

    if (error) {
      console.error("Error al cargar carrito:", error);
      setItems([]);
    } else {
      setItems((data as unknown as ItemCarrito[]) || []);
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    cargarCarrito();
  }, [cargarCarrito]);

  const eliminarDelCarrito = async (id: number) => {
    const { error } = await supabase.from("carrito").delete().eq("id", id);

    if (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar producto");
      return;
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const finalizarCompra = async () => {
    setProcesando(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/auth/login");
        return;
      }

      const res = await fetch("/api/ordenes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "Error al crear orden");
        return;
      }

      const ordenId = result.data?.id || result.orden?.id || result.id;

      if (ordenId) {
        router.push(`/checkout?orden=${ordenId}`);
      } else {
        router.push("/ordenes");
      }
    } catch (err) {
      console.error(err);
      alert("Error al finalizar compra");
    } finally {
      setProcesando(false);
    }
  };

  const total = items.reduce((acc, item) => {
    if (!item.productos) return acc;
    return acc + Number(item.productos.precio) * item.cantidad;
  }, 0);

  return (
    <>
      <Header />

      <main className="cart-page">
        <section className="cart-container">
          <div className="breadcrumb">
            <Link href="/">Inicio</Link>
            <span>/</span>
            <span>Carrito</span>
          </div>

          <div className="cart-title-box">
            <p className="eyebrow">Tu compra</p>
            <h1>Mi carrito</h1>
            <p>
              Revisá tus productos antes de finalizar la compra con Mercado
              Pago.
            </p>
          </div>

          {loading ? (
            <div className="empty-card">
              <div className="loader" />
              <p>Cargando carrito...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="empty-card">
              <div className="empty-icon">🛒</div>
              <h2>Tu carrito está vacío</h2>
              <p>Agregá productos para continuar con tu compra.</p>

              <Link href="/productos" className="primary-link">
                Ver productos
              </Link>
            </div>
          ) : (
            <div className="cart-layout">
              <div className="items-list">
                {items.map((item) => {
                  if (!item.productos) return null;

                  const subtotal =
                    Number(item.productos.precio) * item.cantidad;

                  return (
                    <article key={item.id} className="cart-item">
                      <div className="image-wrap">
                        {item.productos.imagen_url ? (
                          <img
                            src={item.productos.imagen_url}
                            alt={item.productos.nombre}
                          />
                        ) : (
                          <div className="image-placeholder">Sin imagen</div>
                        )}
                      </div>

                      <div className="item-info">
                        <div>
                          <h2>{item.productos.nombre}</h2>

                          {item.productos.descripcion && (
                            <p className="description">
                              {item.productos.descripcion}
                            </p>
                          )}

                          <div className="details-row">
                            <span>Cantidad: {item.cantidad}</span>
                            <span>
                              Precio unitario: $
                              {Number(
                                item.productos.precio
                              ).toLocaleString("es-AR")}
                            </span>
                          </div>
                        </div>

                        <div className="item-bottom">
                          <strong>
                            ${subtotal.toLocaleString("es-AR")}
                          </strong>

                          <button
                            type="button"
                            onClick={() => eliminarDelCarrito(item.id)}
                            className="delete-button"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <aside className="summary-card">
                <h2>Resumen</h2>

                <div className="summary-line">
                  <span>Productos</span>
                  <strong>{items.length}</strong>
                </div>

                <div className="summary-line">
                  <span>Envío</span>
                  <strong>A coordinar</strong>
                </div>

                <div className="total-box">
                  <span>Total</span>
                  <strong>${total.toLocaleString("es-AR")}</strong>
                </div>

                <button
                  type="button"
                  onClick={finalizarCompra}
                  disabled={procesando}
                  className="checkout-button"
                >
                  {procesando ? "Procesando..." : "Finalizar compra"}
                </button>

                <Link href="/productos" className="continue-link">
                  Seguir comprando
                </Link>

                <p className="secure-text">
                  Pago seguro mediante Mercado Pago Sandbox.
                </p>
              </aside>
            </div>
          )}
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .cart-page {
          min-height: calc(100vh - 120px);
          background: #f5f2ed;
          padding: 48px 20px;
          color: #181818;
        }

        .cart-container {
          max-width: 1180px;
          margin: 0 auto;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
          font-size: 14px;
          color: #777;
        }

        .breadcrumb a {
          color: #181818;
          text-decoration: none;
          font-weight: 600;
        }

        .breadcrumb a:hover {
          text-decoration: underline;
        }

        .cart-title-box {
          margin-bottom: 34px;
        }

        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 12px;
          font-weight: 700;
          color: #8b6f47;
          margin-bottom: 8px;
        }

        .cart-title-box h1 {
          font-size: clamp(36px, 5vw, 58px);
          line-height: 1;
          margin: 0 0 12px;
          letter-spacing: -0.04em;
        }

        .cart-title-box p {
          margin: 0;
          color: #666;
          max-width: 560px;
          font-size: 16px;
          line-height: 1.6;
        }

        .cart-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 360px;
          gap: 28px;
          align-items: start;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .cart-item {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 24px;
          background: #fff;
          border: 1px solid #e7e0d8;
          border-radius: 26px;
          padding: 18px;
          box-shadow: 0 18px 45px rgba(20, 20, 20, 0.08);
        }

        .image-wrap {
          background: #f4f4f4;
          border-radius: 20px;
          overflow: hidden;
          min-height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-wrap img {
          width: 100%;
          height: 100%;
          min-height: 220px;
          object-fit: cover;
          display: block;
        }

        .image-placeholder {
          color: #999;
          font-size: 14px;
        }

        .item-info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 28px;
          padding: 8px 4px;
        }

        .item-info h2 {
          margin: 0 0 10px;
          font-size: 26px;
          letter-spacing: -0.03em;
        }

        .description {
          margin: 0 0 18px;
          color: #666;
          line-height: 1.5;
        }

        .details-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .details-row span {
          background: #f5f2ed;
          border: 1px solid #e7e0d8;
          border-radius: 999px;
          padding: 9px 13px;
          font-size: 14px;
          color: #555;
        }

        .item-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .item-bottom strong {
          font-size: 26px;
          letter-spacing: -0.03em;
        }

        .delete-button {
          border: 1px solid #d94b4b;
          background: #fff;
          color: #c93434;
          border-radius: 999px;
          padding: 10px 16px;
          cursor: pointer;
          font-weight: 700;
          transition: 0.2s ease;
        }

        .delete-button:hover {
          background: #fff1f1;
          transform: translateY(-1px);
        }

        .summary-card {
          position: sticky;
          top: 24px;
          background: #181818;
          color: #fff;
          border-radius: 28px;
          padding: 26px;
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.22);
        }

        .summary-card h2 {
          margin: 0 0 22px;
          font-size: 28px;
          letter-spacing: -0.04em;
        }

        .summary-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          color: #d6d6d6;
        }

        .summary-line strong {
          color: #fff;
        }

        .total-box {
          margin: 22px 0;
          background: #fff;
          color: #181818;
          border-radius: 20px;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .total-box span {
          color: #666;
          font-weight: 700;
        }

        .total-box strong {
          font-size: 30px;
          letter-spacing: -0.04em;
        }

        .checkout-button {
          width: 100%;
          border: none;
          background: #f0c36a;
          color: #181818;
          border-radius: 999px;
          padding: 16px 18px;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .checkout-button:hover:not(:disabled) {
          background: #ffd782;
          transform: translateY(-2px);
        }

        .checkout-button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .continue-link {
          display: block;
          text-align: center;
          color: #fff;
          margin-top: 16px;
          text-decoration: none;
          font-weight: 700;
        }

        .continue-link:hover {
          text-decoration: underline;
        }

        .secure-text {
          margin: 22px 0 0;
          color: #bdbdbd;
          font-size: 13px;
          line-height: 1.5;
          text-align: center;
        }

        .empty-card {
          background: #fff;
          border: 1px solid #e7e0d8;
          border-radius: 28px;
          padding: 52px 28px;
          text-align: center;
          box-shadow: 0 18px 45px rgba(20, 20, 20, 0.08);
        }

        .empty-icon {
          width: 72px;
          height: 72px;
          margin: 0 auto 18px;
          border-radius: 50%;
          background: #f5f2ed;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 34px;
        }

        .empty-card h2 {
          margin: 0 0 10px;
          font-size: 30px;
          letter-spacing: -0.03em;
        }

        .empty-card p {
          margin: 0 0 24px;
          color: #666;
        }

        .primary-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #181818;
          color: #fff;
          text-decoration: none;
          border-radius: 999px;
          padding: 14px 22px;
          font-weight: 800;
        }

        .loader {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 3px solid #ddd;
          border-top-color: #181818;
          margin: 0 auto 18px;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 900px) {
          .cart-layout {
            grid-template-columns: 1fr;
          }

          .summary-card {
            position: static;
          }

          .cart-item {
            grid-template-columns: 1fr;
          }

          .image-wrap img,
          .image-wrap {
            min-height: 280px;
          }
        }

        @media (max-width: 520px) {
          .cart-page {
            padding: 32px 14px;
          }

          .cart-item {
            padding: 14px;
            border-radius: 22px;
          }

          .item-bottom {
            align-items: flex-start;
            flex-direction: column;
          }

          .summary-card {
            border-radius: 22px;
          }

          .total-box {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }
        }
      `}</style>
    </>
  );
}