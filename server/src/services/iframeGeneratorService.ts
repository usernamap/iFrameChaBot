import fs from 'fs/promises';
import path from 'path';
import { Order } from '../interfaces/Order';
import { ChatbotConfig, CompanyInfo } from '../interfaces/ChatbotConfig';
import logger from '../utils/logger';
import { sanitizeHtml, sanitizeJs, sanitizeCss } from '../utils/sanitizers';
import { generateUniqueId } from '../utils/idGenerator';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class IframeGeneratorService {
    private readonly templatePath: string;
    private readonly outputDir: string;
    private readonly jsTemplatePath: string;
    private readonly cssTemplatePath: string;

    constructor() {
        this.templatePath = path.join(__dirname, '../templates/chatbot-template.html');
        this.jsTemplatePath = path.join(__dirname, '../templates/chatbot-template.js');
        this.cssTemplatePath = path.join(__dirname, '../templates/chatbot-styles.css');
        this.outputDir = path.join(__dirname, '../public/iframes');
    }

    async generateIframe(order: Order): Promise<string> {
        try {
            let htmlTemplate = await this.readFile(this.templatePath);
            let jsTemplateContent = await this.readFile(this.jsTemplatePath);
            let cssTemplate = await this.readFile(this.cssTemplatePath);

            const uniqueId = generateUniqueId(order.orderNumber || 'default');

            await this.generateTailwindCSS(cssTemplate, uniqueId);

            // Injecter les configurations dans le HTML plutôt que dans le JS
            htmlTemplate = this.replaceHtmlPlaceholders(htmlTemplate, order.chatbotConfig, order.companyInfo, uniqueId);
            jsTemplateContent = this.replaceJsPlaceholders(jsTemplateContent, uniqueId);
            cssTemplate = this.replaceCssPlaceholders(cssTemplate, order.chatbotConfig);

            const jsTemplate = await this.transpileJs(jsTemplateContent, this.jsTemplatePath);

            const htmlFileName = `${uniqueId}.html`;
            const jsFileName = `${uniqueId}.js`;
            const cssFileName = `${uniqueId}.css`;

            await this.ensureDirectoryExists(this.outputDir);

            await this.writeFile(path.join(this.outputDir, htmlFileName), htmlTemplate);
            await this.writeFile(path.join(this.outputDir, jsFileName), jsTemplate);
            await this.writeFile(path.join(this.outputDir, cssFileName), cssTemplate);

            logger.info(`Fichiers générés : ${htmlFileName}, ${jsFileName}, ${cssFileName}`);

            return `/iframes/${htmlFileName}`;
        } catch (error) {
            logger.error('Erreur lors de la génération de l\'iframe:', error);
            throw new Error('Impossible de générer l\'iframe');
        }
    }

    private async generateTailwindCSS(cssContent: string, uniqueId: string): Promise<void> {
        const tempCssPath = path.join(__dirname, `../temp/${uniqueId}.css`);
        const outputCssPath = path.join(this.outputDir, `${uniqueId}.css`);

        // Écrire le contenu CSS temporaire
        await fs.writeFile(tempCssPath, cssContent);

        // Exécuter Tailwind CLI
        await execAsync(`npx tailwindcss -i ${tempCssPath} -o ${outputCssPath} --minify`);

        // Supprimer le fichier temporaire
        await fs.unlink(tempCssPath);
    }

    private async transpileJs(jsCode: string, filename: string): Promise<string> {
        const babel = require('@babel/core');
        const result = await babel.transformAsync(jsCode, {
            filename: filename,
            presets: ['@babel/preset-env', '@babel/preset-react'],
        });
        return result.code;
    }

    private async readFile(filePath: string): Promise<string> {
        try {
            return await fs.readFile(filePath, 'utf-8');
        } catch (error) {
            logger.error(`Erreur lors de la lecture du fichier ${filePath}:`, error);
            throw new Error(`Impossible de lire le fichier ${filePath}`);
        }
    }

    private async writeFile(filePath: string, content: string): Promise<void> {
        try {
            await fs.writeFile(filePath, content);
        } catch (error) {
            logger.error(`Erreur lors de l'écriture du fichier ${filePath}:`, error);
            throw new Error(`Impossible d'écrire le fichier ${filePath}`);
        }
    }

    private async ensureDirectoryExists(dirPath: string): Promise<void> {
        try {
            await fs.mkdir(dirPath, { recursive: true });
        } catch (error) {
            logger.error(`Erreur lors de la création du répertoire ${dirPath}:`, error);
            throw new Error(`Impossible de créer le répertoire ${dirPath}`);
        }
    }

    private replaceHtmlPlaceholders(template: string, config: ChatbotConfig, companyInfo: CompanyInfo, uniqueId: string): string {
        const configScript = `<script>
            window.CHATBOT_CONFIG = ${JSON.stringify(config)};
            window.COMPANY_INFO = ${JSON.stringify(companyInfo)};
        </script>`;

        const placeholders: { [key: string]: string } = {
            '{{CHATBOT_TITLE}}': sanitizeHtml(config.headerTitle || 'Assistant Virtuel'),
            '{{PRIMARY_COLOR}}': sanitizeHtml(config.primaryColor || '#0000FF'),
            '{{TEXT_COLOR}}': sanitizeHtml(config.textColor || '#FFFFFF'),
            '{{FONT_FAMILY}}': sanitizeHtml(config.fontFamily || 'Arial, sans-serif'),
            '{{FONT_SIZE}}': sanitizeHtml(config.fontSize || '14px'),
            '{{UNIQUE_ID}}': sanitizeHtml(uniqueId),
            '{{COMPANY_NAME}}': sanitizeHtml(companyInfo.name),
            '{{CONFIG_SCRIPT}}': configScript,
        };

        return Object.entries(placeholders).reduce((acc, [key, value]) =>
            acc.replace(new RegExp(key, 'g'), value), template);
    }

    private replaceJsPlaceholders(template: string, uniqueId: string): string {
        // Nous n'avons plus besoin de remplacer CHATBOT_CONFIG et COMPANY_INFO ici
        // car ils sont maintenant injectés dans le HTML
        return template.replace(/\{\{UNIQUE_ID\}\}/g, sanitizeJs(uniqueId));
    }

    private replaceCssPlaceholders(template: string, config: ChatbotConfig): string {
        const placeholders: { [key: string]: string } = {
            '{{PRIMARY_COLOR}}': sanitizeCss(config.primaryColor || '#0000FF'),
            '{{TEXT_COLOR}}': sanitizeCss(config.textColor || '#FFFFFF'),
            '{{FONT_FAMILY}}': sanitizeCss(config.fontFamily || 'Arial, sans-serif'),
            '{{FONT_SIZE}}': sanitizeCss(config.fontSize || '14px'),
            '{{USER_MESSAGE_BACKGROUND_COLOR}}': sanitizeCss(config.userMessageBackgroundColor || '#E1E1E1'),
            '{{USER_MESSAGE_TEXT_COLOR}}': sanitizeCss(config.userMessageTextColor || '#000000'),
            '{{BOT_MESSAGE_BACKGROUND_COLOR}}': sanitizeCss(config.botMessageBackgroundColor || '#F1F1F1'),
            '{{BOT_MESSAGE_TEXT_COLOR}}': sanitizeCss(config.botMessageTextColor || '#000000'),
        };

        return Object.entries(placeholders).reduce((acc, [key, value]) =>
            acc.replace(new RegExp(key, 'g'), value), template);
    }
}

export default new IframeGeneratorService();