import { MercadoPagoConfig, Preference } from "mercadopago";

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error("Falta MERCADOPAGO_ACCESS_TOKEN en .env.local");
}

const client = new MercadoPagoConfig({
  accessToken,
});

export const preferenceClient = new Preference(client);