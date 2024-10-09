import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window as unknown as Window);

/**
 * Sanitize HTML content to prevent XSS attacks.
 * @param html The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
    // Implémentation basique de sanitization HTML
    return html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Sanitize JavaScript content to prevent potential code injection.
 * @param js The JavaScript string to sanitize
 * @returns Sanitized JavaScript string
 */
export function sanitizeJs(js: string): string {
    // Remove potential script tags
    js = js.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Encode special characters
    js = js.replace(/[&<>"']/g, function (m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[m] || m;
    });

    return js;
}

/**
 * Sanitize a string for use in CSS.
 * @param css The CSS string to sanitize
 * @returns Sanitized CSS string
 */
export function sanitizeCss(css: string): string {
    // Remove potentially harmful CSS
    css = css.replace(/@import\s+/, '');
    css = css.replace(/behavior\s*:/, '');
    css = css.replace(/expression\s*\(/, '');
    css = css.replace(/javascript\s*:/, '');

    return css;
}

/**
 * Sanitize a filename to ensure it's safe for file system operations.
 * @param filename The filename to sanitize
 * @returns Sanitized filename
 */
export function sanitizeFilename(filename: string | undefined): string {
    if (typeof filename !== 'string' || filename.trim() === '') {
        return 'default-filename'; // ou un autre nom de fichier par défaut
    }
    return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}