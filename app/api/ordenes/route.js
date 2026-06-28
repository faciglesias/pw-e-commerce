import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { successResponse, errorResponse } from "@/lib/api/responses";

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

async function getUserFromRequest(request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return null;
  }

  const token = authHeader.replace("Bearer ", "");
  const supabase = crearSupabaseConToken(token);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function GET(request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return errorResponse("No autenticado", "UNAUTHORIZED", 401);
    }

    const { data, error } = await supabaseAdmin
      .from("ordenes")
      .select("*")
      .eq("usuario_id", user.id)
      .order("creado_en", { ascending: false });

    if (error) {
      return errorResponse(error.message, "ORDERS_FETCH_ERROR", 500);
    }

    return successResponse(data);
  } catch (err) {
    console.error(err);
    return errorResponse("Error al obtener órdenes", "SERVER_ERROR", 500);
  }
}

export async function POST(request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return errorResponse("No autenticado", "UNAUTHORIZED", 401);
    }

    const { data: carritoItems, error: carritoError } = await supabaseAdmin
      .from("carrito")
      .select(`
        id,
        cantidad,
        productos (
          id,
          precio,
          stock
        )
      `)
      .eq("usuario_id", user.id);

    if (carritoError) {
      return errorResponse(carritoError.message, "CART_FETCH_ERROR", 500);
    }

    if (!carritoItems || carritoItems.length === 0) {
      return errorResponse("El carrito está vacío", "EMPTY_CART", 400);
    }

    for (const item of carritoItems) {
      if (!item.productos) {
        return errorResponse("Producto inválido", "INVALID_PRODUCT", 400);
      }

      if (item.productos.stock < item.cantidad) {
        return errorResponse("Stock insuficiente", "INSUFFICIENT_STOCK", 400);
      }
    }

    const total = carritoItems.reduce((sum, item) => {
      return sum + Number(item.productos.precio) * item.cantidad;
    }, 0);

    const items = carritoItems.map((item) => ({
      producto_id: item.productos.id,
      cantidad: item.cantidad,
      precio: Number(item.productos.precio),
    }));

    const { data, error } = await supabaseAdmin.rpc("crear_orden_completa", {
      p_usuario_id: user.id,
      p_items: items,
      p_total: total,
    });

    if (error) {
      return errorResponse(error.message, "ORDER_TRANSACTION_ERROR", 500);
    }

    const resultado = data?.[0];

    if (!resultado || !resultado.success) {
      return errorResponse(
        resultado?.error_msg || "Error al crear orden",
        "ORDER_CREATE_ERROR",
        400
      );
    }

    return successResponse(
      {
        id: resultado.orden_id,
        total,
        estado: "pendiente",
      },
      201
    );
  } catch (err) {
    console.error(err);
    return errorResponse("Error al crear orden", "SERVER_ERROR", 500);
  }
}