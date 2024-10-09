// src/services/orderService.ts

import OrderModel, { IOrder } from '../models/Order';
import { Order } from '../interfaces/Order';

class OrderService {
    public async createOrder(orderData: Order): Promise<IOrder> {
        const order = new OrderModel(orderData);
        return await order.save();
    }

    public async getOrderByNumber(orderNumber: string): Promise<IOrder | null> {
        return await OrderModel.findOne({ orderNumber });
    }

    public async getOrderById(orderId: string): Promise<IOrder | null> {
        return await OrderModel.findById(orderId);
    }
}

export default new OrderService();
