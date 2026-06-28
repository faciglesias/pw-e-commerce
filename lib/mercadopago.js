import { MercadoPagoConfig, Preference } from "mercadopago";

export const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export const preferenceClient = new Preference(mercadoPagoClient);