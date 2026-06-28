import { supabase } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/lib/api/responses";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      return errorResponse(
        error.message,
        "PRODUCTS_FETCH_ERROR",
        500
      );
    }

    return successResponse(data);
  } catch (err) {
    console.error(err);

    return errorResponse(
      "Error al obtener productos",
      "SERVER_ERROR",
      500
    );
  }
}