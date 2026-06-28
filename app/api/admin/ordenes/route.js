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

async function verificarAdmin(userId) {
  const { data, error } = await supabaseAdmin
    .from("usuarios")
    .select("rol")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return false;
  }

  return data.rol === "admin";
}

export async function GET(request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return errorResponse("No autenticado", "UNAUTHORIZED", 401);
    }

    const esAdmin = await verificarAdmin(user.id);

    if (!esAdmin) {
      return errorResponse("No autorizado", "FORBIDDEN", 403);
    }

    const { data, error } = await supabaseAdmin
      .from("ordenes")
      .select("*")
      .order("creado_en", { ascending: false });

    if (error) {
      return errorResponse(error.message, "ORDERS_FETCH_ERROR", 500);
    }

    return successResponse(data);
  } catch (err) {
    console.error("Error admin órdenes:", err);

    return errorResponse(
      "Error al obtener órdenes",
      "SERVER_ERROR",
      500
    );
  }
}

export async function PATCH(request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return errorResponse("No autenticado", "UNAUTHORIZED", 401);
    }

    const esAdmin = await verificarAdmin(user.id);

    if (!esAdmin) {
      return errorResponse("No autorizado", "FORBIDDEN", 403);
    }

    const body = await request.json();

    const ordenId = Number(body.orden_id);
    const estado = String(body.estado || "").trim();

    const estadosPermitidos = [
      "pendiente",
      "pagada",
      "confirmada",
      "enviada",
      "entregada",
      "cancelada",
    ];

    if (!ordenId || !estadosPermitidos.includes(estado)) {
      return errorResponse("Datos inválidos", "INVALID_DATA", 400);
    }

    const datosActualizar = {
      estado,
    };

    if (estado === "pagada") {
      datosActualizar.pagado_en = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from("ordenes")
      .update(datosActualizar)
      .eq("id", ordenId)
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, "ORDER_UPDATE_ERROR", 500);
    }

    return successResponse(data);
  } catch (err) {
    console.error("Error actualizando orden:", err);

    return errorResponse(
      "Error al actualizar orden",
      "SERVER_ERROR",
      500
    );
  }
}