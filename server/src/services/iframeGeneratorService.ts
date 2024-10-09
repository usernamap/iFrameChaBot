import fs from 'fs/promises';
import path from 'path';
import { Order } from '../interfaces/Order';
import { ChatbotConfig } from '../interfaces/ChatbotConfig';
import { CompanyInfo } from '../interfaces/CompanyInfo';

class IframeGeneratorService {
    private readonly templatePath: string;
    private readonly outputDir: string;

    constructor() {
        this.templatePath = path.join(__dirname, '../templates/chatbot-template.html');
        this.outputDir = path.join(__dirname, '../public/iframes');
    }

    async generateIframe(order: Order): Promise<string> {
        try {
            // Lire les templates
            let htmlTemplate = await fs.readFile(this.templatePath, 'utf-8');
            let jsTemplate = await fs.readFile(path.join(__dirname, '../templates/chatbot-template.js'), 'utf-8');

            // Générer un ID unique
            const uniqueId = `iframe-${order.orderNumber}`;

            // Remplacer les placeholders dans les templates
            htmlTemplate = this.replacePlaceholders(htmlTemplate, order.chatbotConfig, order.companyInfo, uniqueId);
            console.log('Template JS avant remplacement:', jsTemplate);
            jsTemplate = this.replacePlaceholders(jsTemplate, order.chatbotConfig, order.companyInfo, uniqueId);
            console.log('Template JS après remplacement:', jsTemplate);
            const htmlFileName = `${uniqueId}.html`;
            const jsFileName = `${uniqueId}.js`;

            const htmlPath = path.join(this.outputDir, htmlFileName);
            const jsPath = path.join(this.outputDir, jsFileName);

            // Écrire les fichiers
            await fs.writeFile(htmlPath, htmlTemplate);
            await fs.writeFile(jsPath, jsTemplate);

            // Retourner l'URL relative de l'iframe HTML
            return `/iframes/${htmlFileName}`;
        } catch (error) {
            console.error('Erreur lors de la génération de l\'iframe:', error);
            throw new Error('Impossible de générer l\'iframe');
        }
    }

    private replacePlaceholders(template: string, config: ChatbotConfig, companyInfo: CompanyInfo, uniqueId: string): string {
        // Pour le template JS, insérez les objets directement sans les entourer de guillemets supplémentaires
        template = template.replace('{{CHATBOT_CONFIG}}', JSON.stringify(config, null, 2));
        template = template.replace('{{COMPANY_INFO}}', JSON.stringify(companyInfo, null, 2));

        // Remplacer d'autres placeholders si nécessaire
        template = template.replace('{{CHATBOT_TITLE}}', config.headerTitle || 'Assistant Virtuel');
        template = template.replace('{{PRIMARY_COLOR}}', config.primaryColor || '#0000FF');
        template = template.replace('{{TEXT_COLOR}}', config.textColor || '#FFFFFF');
        template = template.replace('{{FONT_FAMILY}}', config.fontFamily || 'Arial, sans-serif');
        template = template.replace('{{FONT_SIZE}}', config.fontSize || '14px');
        template = template.replace(/\{\{UNIQUE_ID\}\}/g, uniqueId);

        return template;
    }
}

export default new IframeGeneratorService();