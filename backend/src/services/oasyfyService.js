import axios from "axios";

class OasyfyService {
  constructor() {
    console.log("===== OASYFY =====");
    console.log("PUBLIC:", process.env.OASYFY_PUBLIC_KEY);
    console.log(
      "SECRET:",
      process.env.OASYFY_SECRET_KEY ? "OK" : "NÃO ENCONTRADA",
    );

    this.api = axios.create({
      baseURL: "https://app.oasyfy.com/api/v1",
      headers: {
        "x-public-key": process.env.OASYFY_PUBLIC_KEY,
        "x-secret-key": process.env.OASYFY_SECRET_KEY,
        "Content-Type": "application/json",
        "User-Agent": "TelegramBot/1.0",
      },
    });
  }

  async createPix(order) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);

    const { data } = await this.api.post("/gateway/pix/receive", {
      identifier: order.orderId.toString(),

      amount: Number(order.amount),

      client: {
        name: `Telegram ${order.telegramId}`,
        email: `telegram_${order.telegramId}@bot.com`,
        phone: "11999999999",
        document: "00000000000",
      },

      products: [
        {
          id: order.productId.toString(),
          name: order.productName,
          quantity: 1,
          price: Number(order.amount),
        },
      ],

      dueDate: dueDate.toISOString().split("T")[0],

      callbackUrl: `${process.env.API_URL}/webhook/oasyfy`,
    });

    console.log("Resposta da Oasyfy:");
    console.log(JSON.stringify(data, null, 2));
    console.log(data);
    return data;
  }

  async getPayment(id) {
    const { data } = await this.api.get(`/gateway/transactions/${id}`);
    return data;
  }
}

export default new OasyfyService();
