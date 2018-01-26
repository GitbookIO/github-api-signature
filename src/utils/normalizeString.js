/* @flow */

/*
 * Normalize a string by using UNIX newlines and trimming
 */
function normalizeString(str: string): string {
    return str.replace(/\r\n/g, '\n').trim();
}

export default normalizeString;
