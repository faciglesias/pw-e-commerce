import { createClient } from "@supabase/supabase-js";
import { successResponse, errorResponse } from "@/lib/api/responses";
import { validarCantidad } from "@/lib/api/validaciones";

function crearSupabaseConToken(token) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
}

export async function POST(request) {
  try {
    const body = await request.json();

    const producto_id = Number(body.producto_id);
    const cantidad = Number(body.cantidad || 1);

    if (!producto_id || !validarCantidad(cantidad)) {
      return errorResponse("Datos inválidos", "INVALID_DATA", 400);
    }

    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return errorResponse("No autenticado", "UNAUTHORIZED", 401);
    }

    const token = authHeader.replace("Bearer ", "");

    const supabase = crearSupabaseConToken(token);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return errorResponse("No autenticado", "UNAUTHORIZED", 401);
    }

    const { data: producto, error: productoError } = await supabase
      .from("productos")
      .select("id, stock")
      .eq("id", producto_id)
      .single();

    if (productoError || !producto) {
      return errorResponse("Producto no encontrado", "PRODUCT_NOT_FOUND", 404);
    }

    if (producto.stock < cantidad) {
      return errorResponse("Stock insuficiente", "INSUFFICIENT_STOCK", 400);
    }

    const { data, error } = await supabase
      .from("carrito")
      .upsert(
        {
          usuario_id: user.id,
          producto_id,
          cantidad,
        },
        {
          onConflict: "usuario_id,producto_id",
        }
      )
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, "CART_INSERT_ERROR", 500);
    }

    return successResponse(data, 201);
  } catch (err) {
    console.error(err);

    return errorResponse(
      "Error al agregar al carrito",
      "SERVER_ERROR",
      500
    );
  }
}