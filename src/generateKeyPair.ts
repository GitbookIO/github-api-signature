import { generateKey } from 'openpgp';
import { KeyPair, UserInformations } from './types';
import { normalizeString } from './utils';

/*
 * Generate a key pair given an user informations and a passphrase.
 * rsaBits defaults to the max value of 4096.
 */
export async function generateKeyPair(
    user: UserInformations,
    passphrase: string,
    type: 'ecc' | 'rsa' = 'ecc',
    rsaBits: number = 4096
): Promise<KeyPair> {
    // Generate key pair
    const keyPair = await generateKey({
        userIDs: [{ name: user.name, email: user.email }],
        rsaBits,
        passphrase,
        type
    });

    // Replace newlines and trim
    const publicKey = normalizeString(keyPair.publicKeyArmored);
    const privateKey = normalizeString(keyPair.privateKeyArmored);

    return {
        publicKey,
        privateKey
    };
}
