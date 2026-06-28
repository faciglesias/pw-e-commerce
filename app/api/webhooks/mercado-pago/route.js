import { successResponse, errorResponse } from "@/lib/api/responses";

export async function GET() {
  return successResponse({
    mensaje: "Webhook de Mercado Pago activo",
  });
}

export async function POST(request) {
  try {
    const body = await request.json();

    console.log("Webhook Mercado Pago recibido:", body);

    return successResponse({
      recibido: true,
      mensaje: "Notificación recibida correctamente",
      data: body,
    });
  } catch (err) {
    console.error("Error en webhook Mercado Pago:", err);

    return errorResponse(
      "Error al procesar webhook",
      "WEBHOOK_ERROR",
      500
    );
  }
}