/* @flow */

import userToString from './userToString';
import type { CommitPayload } from '../types';

/*
 * Transform a commit payload to a commit message
 */
function commitToString({
    message,
    tree,
    parents,
    author,
    // Default committer to author if not defined
    committer = author
}: CommitPayload) {
    return `
tree ${tree}
${parents.map(parent => `parent ${parent}`).join('\n')}
author ${userToString(author)}
committer ${userToString(committer)}

${message}`.trim();
}

export default commitToString;
