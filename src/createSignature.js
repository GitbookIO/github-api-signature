/* @flow */

import * as openpgp from 'openpgp';
import { commitToString, normalizeString } from './utils';
import type { CommitPayload } from './types';

/*
 * Generate a signature for the GitHub API using the create commit payload,
 * a PGP private key and its passphrase.
 * https://developer.github.com/v3/git/commits/#create-a-commit
 */
async function createSignature(
    commit: CommitPayload,
    privateKey: string,
    passphrase: string
): Promise<string> {
    // Decrypt the privateKey
    const privateKeyObj = openpgp.key.readArmored(privateKey).keys[0];
    privateKeyObj.decrypt(passphrase);

    const { signature } = await openpgp.sign({
        data: Buffer.from(commitToString(commit), 'utf8'),
        privateKeys: privateKeyObj,
        detached: true
    });

    // Return signature, making sure to replace with UNIX newline
    return normalizeString(signature);
}

export default createSignature;
