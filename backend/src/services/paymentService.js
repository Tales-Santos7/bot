import asaasService from "./asaasService.js";
import orderService from "./orderService.js";

class PaymentService {
  async createOrder(product, telegramId) {

    const order = {
      orderId: Date.now(),
      telegramId,
      productId: product.id,
      productName: product.name,
      amount: product.price,
      status: "pending"
    };

    const payment = await asaasService.createPix(order);

    const qr = await asaasService.getPixQrCode(payment.id);

    order.paymentId = payment.id;
    order.qrCode = qr.payload;
    order.qrCodeBase64 = qr.encodedImage;

    orderService.save(order);

    return order;
  }
}

export default new PaymentService();