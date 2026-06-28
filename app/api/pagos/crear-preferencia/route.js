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

export async function POST(request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return errorResponse("No autenticado", "UNAUTHORIZED", 401);
    }

    const body = await request.json();
    const ordenId = Number(body.orden_id);

    if (!ordenId) {
      return errorResponse("Orden inválida", "INVALID_ORDER", 400);
    }

    const { data: orden, error: ordenError } = await supabaseAdmin
      .from("ordenes")
      .select("*")
      .eq("id", ordenId)
      .eq("usuario_id", user.id)
      .single();

    if (ordenError || !orden) {
      return errorResponse("Orden no encontrada", "ORDER_NOT_FOUND", 404);
    }

    if (orden.estado !== "pendiente") {
      return errorResponse(
        "La orden no está pendiente de pago",
        "ORDER_NOT_PENDING",
        400
      );
    }

    const { data: items, error: itemsError } = await supabaseAdmin
      .from("orden_items")
      .select(`
        id,
        cantidad,
        precio_unitario,
        subtotal,
        productos (
          id,
          nombre,
          descripcion
        )
      `)
      .eq("orden_id", ordenId);

    if (itemsError) {
      return errorResponse(itemsError.message, "ORDER_ITEMS_ERROR", 500);
    }

    if (!items || items.length === 0) {
      return errorResponse(
        "La orden no tiene productos",
        "EMPTY_ORDER_ITEMS",
        400
      );
    }

    const preferencia = {
      external_reference: String(orden.id),
      payer: {
        email: user.email,
      },
      items: items.map((item) => ({
        title: item.productos?.nombre || "Producto",
        description: item.productos?.descripcion || "",
        quantity: item.cantidad,
        unit_price: Number(item.precio_unitario),
        currency_id: "ARS",
      })),
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/pagos/webhook`,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/ordenes`,
        failure: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/checkout?orden=${orden.id}`,
        pending: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/ordenes`,
      },
    };

    return successResponse({
      orden_id: orden.id,
      total: orden.total,
      estado: orden.estado,
      preferencia,
      mensaje:
        "Preferencia preparada. En la próxima clase se conecta con Mercado Pago.",
    });
  } catch (err) {
    console.error(err);

    return errorResponse(
      "Error al crear preferencia de pago",
      "SERVER_ERROR",
      500
    );
  }
}