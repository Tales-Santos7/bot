class OrderService {

    constructor() {
        this.orders = new Map();
    }

    save(order) {
        this.orders.set(order.paymentId.toString(), order);
    }

    find(paymentId) {
        return this.orders.get(paymentId.toString());
    }

    approve(paymentId) {

        const order = this.find(paymentId);

        if (!order) return null;

        order.status = "approved";

        return order;

    }

}

export default new OrderService();