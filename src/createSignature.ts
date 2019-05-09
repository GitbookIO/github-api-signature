import * as openpgp from 'openpgp';
import { CommitPayload } from './types';
import { commitToString, normalizeString } from './utils';

/*
 * Generate a signature for the GitHub API using the create commit payload,
 * a PGP private key and its passphrase.
 * https://developer.github.com/v3/git/commits/#create-a-commit
 */
export async function createSignature(
    commit: CommitPayload,
    privateKey: string,
    passphrase: string
): Promise<string> {
    // Decrypt the privateKey
    const decodedKey = await openpgp.key.readArmored(privateKey);
    if (decodedKey.err) {
        throw decodedKey.err[0];
    }

    const [privateKeyObj] = decodedKey.keys;
    const isDecrypted = await privateKeyObj.decrypt(passphrase);
    if (!isDecrypted) {
        throw new Error('Failed to decrypt private key using given passphrase');
    }

    const { signature } = await openpgp.sign({
        message: openpgp.message.fromText(commitToString(commit)),
        privateKeys: [privateKeyObj],
        detached: true
    });

    // Return signature, making sure to replace with UNIX newline
    return normalizeString(signature);
}
