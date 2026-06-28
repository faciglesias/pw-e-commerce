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
      return Response.json({
        rol: null,
        autenticado: false,
      });
    }

    const { data: perfil, error } = await supabaseAdmin
      .from("usuarios")
      .select("rol")
      .eq("id", user.id)
      .single();

    if (error) {
      return errorResponse(error.message, "ROLE_FETCH_ERROR", 500);
    }

    return successResponse({
      rol: perfil?.rol || "cliente",
      autenticado: true,
      email: user.email,
    });
  } catch (err) {
    console.error(err);

    return errorResponse(
      "Error al obtener rol",
      "SERVER_ERROR",
      500
    );
  }
}