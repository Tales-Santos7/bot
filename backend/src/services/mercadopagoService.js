import dotenv from "dotenv";
dotenv.config();

import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});

const payment = new Payment(client);

class MercadoPagoService {

    async createPix(order) {

        const response = await payment.create({

            body: {

                transaction_amount: Number(order.amount),

                description: order.productName,

                payment_method_id: "pix",

                payer: {
                    email: `telegram_${order.telegramId}@bot.com`
                }

            }

        });

        return response;

    }

    async getPayment(id) {

        return await payment.get({
            id
        });

    }

}

export default new MercadoPagoService();