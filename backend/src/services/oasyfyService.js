import dotenv from "dotenv";
dotenv.config();

import axios from "axios";

class OasyfyService {
  constructor() {
    this.api = axios.create({
      baseURL: "https://app.oasyfy.com/api/v1",
      headers: {
        "x-public-key": process.env.OASYFY_PUBLIC_KEY,
        "x-secret-key": process.env.OASYFY_SECRET_KEY,
        "Content-Type": "application/json",
      },
    });
  }

  async createPix(order) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);

    const { data } = await this.api.post("/gateway/pix/receive", {
      identifier: order.orderId.toString(),

      amount: order.amount,

      client: {
        name: `Telegram ${order.telegramId}`,
        email: `telegram_${order.telegramId}@bot.com`,
        phone: "11999999999",
        document: process.env.OASYFY_DOCUMENT,
      },

      products: [
        {
          id: order.productId.toString(),
          name: order.productName,
          quantity: 1,
          price: order.amount,
        },
      ],

      dueDate: dueDate.toISOString().split("T")[0],

      callbackUrl: `${process.env.API_URL}/webhook/oasyfy`,
    });

    return data;
  }
}

export default new OasyfyService();