import mercadopagoService from "./asaasService.js";
import orderService from "./orderService.js";

class PaymentService {
  async createOrder(product, telegramId) {
    const order = {
      orderId: Date.now(),
      telegramId,
      productId: product.id,
      productName: product.name,
      amount: product.price,
      status: "pending",
    };

    const payment = await pushinPayService.createPix(order);

    order.paymentId = payment.id;
    order.qrCode = payment.point_of_interaction.transaction_data.qr_code;
    order.qrCodeBase64 =
      payment.point_of_interaction.transaction_data.qr_code_base64;

    orderService.save(order);

    return order;
  }
}

export default new PaymentService();
