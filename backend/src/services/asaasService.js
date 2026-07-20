import axios from "axios";

class AsaasService {
  constructor() {
    this.api = axios.create({
      baseURL: process.env.ASAAS_API_URL,
      headers: {
        access_token: process.env.ASAAS_API_KEY,
        "Content-Type": "application/json",
      },
    });
  }

  async createCustomer(order) {
    const { data } = await this.api.post("/customers", {
      name: `Telegram ${order.telegramId}`,
      email: `telegram_${order.telegramId}@bot.com`,
    });

    return data;
  }

  async createPix(order) {
    const customer = await this.createCustomer(order);

    const { data } = await this.api.post("/payments", {
      customer: customer.id,
      billingType: "PIX",
      value: order.amount,
      description: order.productName,
      dueDate: new Date().toISOString().split("T")[0],
    });

    return data;
  }

  async getPixQrCode(paymentId) {
    const { data } = await this.api.get(
      `/payments/${paymentId}/pixQrCode`
    );

    return data;
  }

  async getPayment(paymentId) {
    const { data } = await this.api.get(
      `/payments/${paymentId}`
    );

    return data;
  }
}

export default new AsaasService();