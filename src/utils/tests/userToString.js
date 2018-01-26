/* @flow */

import test from 'ava';
import userToString from '../userToString';
import normalizeOffset from '../normalizeOffset';
import type { GitHubUser } from '../../types';

test('generate the correct string given a GitHubUser', t => {
    const date = new Date('1970-01-01');
    // We need to generate timezone offset for tests to pass on every machine
    const timezone = normalizeOffset(date.getTimezoneOffset());

    const user: GitHubUser = {
        name: 'John Doe',
        email: 'ghost@github.com',
        date: date.toISOString()
    };

    const result = userToString(user);
    t.is(result, `John Doe <ghost@github.com> 0 ${timezone}`);
});
