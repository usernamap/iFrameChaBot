// src/models/Order.ts

import mongoose, { Document, Schema } from 'mongoose';
import { Order } from '../interfaces/Order';

export interface IOrder extends Order, Document { }

const OrderSchema: Schema = new Schema({
    chatbotConfig: { type: Schema.Types.Mixed, required: true },
    companyInfo: { type: Schema.Types.Mixed, required: true },
    selectedSubscription: { type: Schema.Types.Mixed, required: true },
    orderNumber: { type: String, required: true, unique: true },
}, {
    timestamps: true
});

export default mongoose.model<IOrder>('Order', OrderSchema);
