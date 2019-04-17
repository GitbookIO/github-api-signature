/*
 * Normalize a string by using UNIX newlines and trimming
 */
export function normalizeString(str: string): string {
    return str.replace(/\r\n/g, '\n').trim();
}
