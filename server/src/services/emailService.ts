import nodemailer from 'nodemailer';
import { Order } from '../interfaces/Order';
import { AppConfig } from '../config/appConfig';

class EmailService {
    private readonly transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.zoho.eu',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: 'alia.tech@aliatech.fr',
                pass: 'CnA9JVTCemwJ'
            },
            logger: true, // Active la journalisation
            debug: true // Inclut les logs de débogage
        });

        // Vérifiez la configuration du transporteur
        this.transporter.verify((error, success) => {
            if (error) {
                console.error('Erreur de configuration du transporteur d\'e-mail:', error);
            } else {
                console.log('Serveur prêt à envoyer des e-mails');
            }
        });
    }

    async sendOrderNotification(order: Order) {
        const mailOptions = {
            from: 'alia.tech@aliatech.fr',
            to: 'client@aliatech.fr',
            subject: `Nouvelle commande reçue - #${order.orderNumber}`,
            html: this.generateOrderEmailContent(order)
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('E-mail envoyé avec succès:', info.messageId);
        } catch (error) {
            console.error(`Erreur lors de l'envoi de l'e-mail:`, error);
            console.log('Détails de configuration:', {
                host: 'smtp.zoho.eu',
                port: 465,
                secure: true,
                user: 'alia.tech@aliatech.fr',
                pass: 'CnA9JVTCemwJ'
            });
        }
    }

    private generateOrderEmailContent(order: Order): string {
        return `
      <h1>Nouvelle commande reçue</h1>
      <p><strong>Numéro de commande:</strong> ${order.orderNumber}</p>
      <p><strong>Date de commande:</strong> ${order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Date non disponible'}</p>
      
      <h2>Informations sur le client</h2>
      <p><strong>Nom de l'entreprise:</strong> ${order.companyInfo.name}</p>
      <p><strong>Email:</strong> ${order.companyInfo.contact.email}</p>
      <p><strong>Téléphone:</strong> ${order.companyInfo.contact.phone}</p>
      
      <h2>Détails de l'abonnement</h2>
      <p><strong>Nom de l'abonnement:</strong> ${order.selectedSubscription.name}</p>
      <p><strong>Prix:</strong> ${order.selectedSubscription.price} €</p>
      
      <h2>Configuration du chatbot</h2>
      <pre>${JSON.stringify(order.chatbotConfig, null, 2)}</pre>
      
      <h2>Informations détaillées sur l'entreprise</h2>
      <pre>${JSON.stringify(order.companyInfo, null, 2)}</pre>
    `;
    }
}

export default new EmailService();