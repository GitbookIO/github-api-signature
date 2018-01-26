/* @flow */

import test from 'ava';
import * as openpgp from 'openpgp';
import createSignature from '../createSignature';
import generateKeyPair from '../generateKeyPair';
import { commitToString } from '../utils';
import type { UserInformations, CommitPayload } from '../types';

test('generate a valid PGP signature for the provided payload', async t => {
    // Generate a key pair
    const passphrase = 'my secret phrase';
    const numBits = 512;
    const user: UserInformations = {
        name: 'John Doe',
        email: 'ghost@github.com'
    };

    const { publicKey, privateKey } = await generateKeyPair(
        user,
        passphrase,
        numBits
    );

    // Generate a signature
    const commit: CommitPayload = {
        message: 'Commit message',
        tree: 'tree-sha',
        parents: ['parent-sha'],
        author: {
            ...user,
            date: new Date().toISOString()
        }
    };

    const signature = await createSignature(commit, privateKey, passphrase);
    t.true(signature.startsWith('-----BEGIN PGP SIGNATURE-----'));

    // Verify signature
    const verified = await openpgp.verify({
        message: openpgp.message.fromBinary(
            Buffer.from(commitToString(commit), 'utf8')
        ),
        signature: openpgp.signature.readArmored(signature),
        publicKeys: openpgp.key.readArmored(publicKey).keys
    });
    t.true(verified.signatures[0].valid);
});
