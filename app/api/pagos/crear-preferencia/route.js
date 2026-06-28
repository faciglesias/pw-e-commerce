import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { preferenceClient } from "@/lib/mercadopago";
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
          descripcion,
          imagen_url
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

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const preferenceBody = {
      items: items.map((item) => ({
        id: String(item.productos?.id || item.id),
        title: item.productos?.nombre || "Producto",
        description: item.productos?.descripcion || "Producto Nómada",
        quantity: Number(item.cantidad),
        unit_price: Number(item.precio_unitario),
        currency_id: "ARS",
      })),

      back_urls: {
        success: `${appUrl}/pago-completado`,
        failure: `${appUrl}/pago-fallido`,
        pending: `${appUrl}/pago-pendiente`,
      },

      external_reference: String(orden.id),

      metadata: {
        orden_id: orden.id,
        usuario_id: user.id,
      },
    };

    /*
      Solo agregamos notification_url si estás usando Vercel.
      En localhost Mercado Pago no puede llamar a tu webhook local.
    */
    if (!appUrl.includes("localhost")) {
      preferenceBody.notification_url = `${appUrl}/api/webhooks/mercado-pago`;
    }

    console.log("Preferencia enviada a Mercado Pago:", preferenceBody);

    const mercadoPagoResponse = await preferenceClient.create({
      body: preferenceBody,
    });

    console.log("Respuesta Mercado Pago:", mercadoPagoResponse);

    const initPoint =
      mercadoPagoResponse?.sandbox_init_point ||
      mercadoPagoResponse?.init_point;

    if (!initPoint) {
      return errorResponse(
        "Mercado Pago no devolvió URL de pago",
        "MERCADOPAGO_INIT_POINT_ERROR",
        500
      );
    }

    return successResponse({
      orden_id: orden.id,
      total: orden.total,
      estado: orden.estado,
      preference_id: mercadoPagoResponse.id,
      init_point: initPoint,
      sandbox_init_point: mercadoPagoResponse.sandbox_init_point,
      production_init_point: mercadoPagoResponse.init_point,
    });
  } catch (err) {
    console.error("Error Mercado Pago completo:", err);
    console.error("Mensaje:", err?.message);
    console.error("Causa:", err?.cause);
    console.error("Status:", err?.status);
    console.error("Response:", err?.response);

    return errorResponse(
      err?.message || "Error al crear preferencia de pago",
      "MERCADOPAGO_ERROR",
      500
    );
  }
}