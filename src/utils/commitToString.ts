import { CommitPayload } from '../types';
import { userToString } from './userToString';

/*
 * Transform a commit payload to a commit message
 */
export function commitToString({
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
