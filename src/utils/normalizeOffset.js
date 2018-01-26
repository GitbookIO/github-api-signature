/* @flow */

import pad from 'pad';

/*
 * Transforms a Date timezone offset to a normalized time offset.
 * e.g. -60 => +0100
 * Since GitHub API always uses a timezone offset of 0, we actually
 * always return "+0000" (offsetIsZero defaults to true), but the original
 * code can be used in case of updates.
 */
function normalizeOffset(
    offset: number,
    offsetIsZero?: boolean = true
): string {
    if (offsetIsZero) {
        return '+0000';
    }

    return (
        (offset <= 0 ? '+' : '-') +
        pad(2, `${parseInt(Math.abs(offset / 60), 10)}`, '0') +
        pad(2, `${Math.abs(offset % 60)}`, '0')
    );
}

export default normalizeOffset;
