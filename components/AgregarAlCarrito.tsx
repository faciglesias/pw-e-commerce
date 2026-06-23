"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Producto = {
  id: number;
  nombre: string;
};

export default function AgregarAlCarrito({ producto }: { producto: Producto }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAgregar = async () => {
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { error } = await supabase.from("carrito").upsert({
        usuario_id: user.id,
        producto_id: producto.id,
        cantidad: 1,
      });

      if (error) {
        console.error("Error:", error);
        alert("Error al agregar al carrito");
      } else {
        alert("Producto agregado al carrito");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error al agregar al carrito");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className="button-dark" onClick={handleAgregar} disabled={loading}>
      {loading ? "Agregando..." : "Agregar al carrito"}
    </button>
  );
}