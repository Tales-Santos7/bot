import axios from "axios";

class OasyfyService {
  constructor() {
    this.api = axios.create({
      baseURL: "https://app.oasyfy.com/api/v1",
      headers: {
        Authorization: `Bearer ${process.env.OASYFY_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
  }

  async createPix(order) {
    const { data } = await this.api.post("/gateway/pix/receive", {
      identifier: order.orderId.toString(),

      amount: Number(order.amount),

      client: {
        name: `Telegram ${order.telegramId}`,
        email: `telegram_${order.telegramId}@bot.com`,
        phone: "11999999999",
        document: "00000000000"
      },

      products: [
        {
          id: order.productId.toString(),
          name: order.productName,
          quantity: 1,
          price: Number(order.amount)
        }
      ],

      dueDate: new Date().toISOString().split("T")[0],

      callbackUrl: `${process.env.API_URL}/webhook/oasyfy`
    });

    return data;
  }

  async getPayment(id) {
    const { data } = await this.api.get(`/gateway/payment/${id}`);

    return data;
  }
}

export default new OasyfyService();