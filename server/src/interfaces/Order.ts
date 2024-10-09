// src/interfaces/Order.ts

export interface Order {
    chatbotConfig: any;
    companyInfo: any;
    selectedSubscription: any;
    orderNumber: string;
    createdAt?: Date;
    updatedAt?: Date;
}
