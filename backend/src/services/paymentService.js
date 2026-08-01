import mercadopagoService from "./oasyfyService.js";
import orderService from "./orderService.js";

class PaymentService {
  async createOrder(product, telegramId) {
    const order = {
      orderId: Date.now(),
      telegramId,
      productId: product.id,
      productName: product.name,
      amount: product.price,
    };

    const payment = await oasyfyService.createPix(order);

    order.paymentId = payment.transactionId;

    order.qrCode = payment.pix.code;

    order.qrCodeBase64 = payment.pix.base64;

    order.status = "pending";

    orderService.save(order);

    return order;
  }
}

export default new PaymentService();
