/* @flow */

import test from 'ava';
import normalizeOffset from '../normalizeOffset';

test('return GitHub API value by default', t => {
    t.is(normalizeOffset(-60), '+0000');
});

test('normalize different offsets correctly', t => {
    const offsets = [0, -60, -600, 180, 65];
    const results = ['+0000', '+0100', '+1000', '-0300', '-0105'];

    t.deepEqual(offsets.map(offset => normalizeOffset(offset, false)), results);
});
