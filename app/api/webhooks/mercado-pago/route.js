import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { successResponse, errorResponse } from "@/lib/api/responses";

async function obtenerPagoMercadoPago(paymentId) {
  const res = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error Mercado Pago: ${errorText}`);
  }

  return res.json();
}

function mapearEstadoPago(status) {
  if (status === "approved") {
    return "pagada";
  }

  if (status === "pending" || status === "in_process") {
    return "pendiente";
  }

  if (
    status === "rejected" ||
    status === "cancelled" ||
    status === "refunded" ||
    status === "charged_back"
  ) {
    return "cancelada";
  }

  return "pendiente";
}

export async function GET() {
  return successResponse({
    mensaje: "Webhook de Mercado Pago activo",
  });
}

export async function POST(request) {
  try {
    const url = new URL(request.url);
    const body = await request.json().catch(() => ({}));

    console.log("Webhook Mercado Pago recibido:", body);

    const paymentId =
      body?.data?.id ||
      body?.id ||
      url.searchParams.get("data.id") ||
      url.searchParams.get("id");

    const tipo =
      body?.type ||
      body?.topic ||
      url.searchParams.get("type") ||
      url.searchParams.get("topic");

    if (!paymentId) {
      return successResponse({
        recibido: true,
        mensaje: "Webhook recibido sin paymentId",
        tipo,
        body,
      });
    }

    if (tipo && tipo !== "payment") {
      return successResponse({
        recibido: true,
        mensaje: "Notificación recibida, pero no es de tipo payment",
        tipo,
        paymentId,
      });
    }

    const pago = await obtenerPagoMercadoPago(paymentId);

    const ordenId = pago.external_reference;

    if (!ordenId) {
      return successResponse({
        recibido: true,
        mensaje: "Pago recibido sin external_reference",
        paymentId,
        status: pago.status,
      });
    }

    const nuevoEstado = mapearEstadoPago(pago.status);

    const datosActualizar = {
      estado: nuevoEstado,
      metodo_pago: "mercado_pago",
      referencia_pago: String(paymentId),
    };

    if (nuevoEstado === "pagada") {
      datosActualizar.pagado_en = new Date().toISOString();
    }

    const { error } = await supabaseAdmin
      .from("ordenes")
      .update(datosActualizar)
      .eq("id", Number(ordenId));

    if (error) {
      return errorResponse(error.message, "ORDER_UPDATE_ERROR", 500);
    }

    return successResponse({
      recibido: true,
      mensaje: "Orden actualizada correctamente",
      orden_id: ordenId,
      payment_id: paymentId,
      estado_pago_mp: pago.status,
      estado_orden: nuevoEstado,
    });
  } catch (err) {
    console.error("Error en webhook Mercado Pago:", err);

    return errorResponse(
      err?.message || "Error al procesar webhook",
      "WEBHOOK_ERROR",
      500
    );
  }
}