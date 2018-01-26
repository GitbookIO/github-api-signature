/* @flow */

import test from 'ava';
import normalizeOffset from '../normalizeOffset';
import commitToString from '../commitToString';
import type { CommitPayload } from '../../types';

const date = new Date('2018-01-01');
const timezone = normalizeOffset(date.getTimezoneOffset());

const commit: CommitPayload = {
    message: 'Commit message',
    tree: 'tree-sha',
    parents: ['parent-1-sha', 'parent-2-sha'],
    author: {
        name: 'John Doe',
        email: 'ghost@github.com',
        date: date.toISOString()
    }
};

test('default committer to the commit author', t => {
    const result = `
tree tree-sha
parent parent-1-sha
parent parent-2-sha
author John Doe <ghost@github.com> 1514764800 ${timezone}
committer John Doe <ghost@github.com> 1514764800 ${timezone}

Commit message
    `.trim();

    t.is(commitToString(commit), result);
});

test('handle passing a committer', t => {
    const commitWithCommitter: CommitPayload = {
        ...commit,
        committer: {
            name: 'Dohn Joe',
            email: 'github@ghost.com',
            date: date.toISOString()
        }
    };

    const result = `
tree tree-sha
parent parent-1-sha
parent parent-2-sha
author John Doe <ghost@github.com> 1514764800 ${timezone}
committer Dohn Joe <github@ghost.com> 1514764800 ${timezone}

Commit message
    `.trim();

    t.is(commitToString(commitWithCommitter), result);
});
