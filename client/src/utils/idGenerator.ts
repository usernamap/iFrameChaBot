import { v4 as uuidv4 } from 'uuid';
import { sanitizeFilename } from './sanitizers';

/**
 * Generate a unique identifier based on the given base string.
 * @param base The base string to use for generating the unique ID
 * @returns A unique identifier string
 */
export function generateUniqueId(base: string): string {
    const sanitizedBase = sanitizeFilename(base);
    const uniquePart = uuidv4().split('-')[0]; // Use first part of UUID for brevity
    return `${sanitizedBase}-${uniquePart}`;
}

/**
 * Generate a completely random unique identifier.
 * @returns A random unique identifier string
 */
export function generateRandomUniqueId(): string {
    return uuidv4();
}

/**
 * Generate a timestamp-based unique identifier.
 * @returns A timestamp-based unique identifier string
 */
export function generateTimestampId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a sequential unique identifier.
 * @param prefix An optional prefix for the ID
 * @returns A function that generates sequential IDs
 */
export function createSequentialIdGenerator(prefix: string = 'id') {
    let counter = 0;
    return function (): string {
        counter++;
        return `${prefix}-${counter}`;
    };
}