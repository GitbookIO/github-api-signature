import test from 'ava';
import { normalizeString } from '../normalizeString';

test('trim the string', t => {
    const str = '   test\ntext\n';
    t.is(normalizeString(str), 'test\ntext');
});

test('replace newlines to UNIX style', t => {
    const str = 'test\r\ntext';
    t.is(normalizeString(str), 'test\ntext');
});

test('do both', t => {
    const str = '   test\r\ntext\r\n';
    t.is(normalizeString(str), 'test\ntext');
});
