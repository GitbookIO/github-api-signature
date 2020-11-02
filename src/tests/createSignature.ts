import test from 'ava';
import * as openpgp from 'openpgp';
import { createSignature } from '../createSignature';
import { generateKeyPair } from '../generateKeyPair';
import { CommitPayload, UserInformations } from '../types';
import { commitToString } from '../utils';

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

    // Generate a signature from a given CommitPayload object
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
        message: openpgp.message.fromText(commitToString(commit)),
        signature: await openpgp.signature.readArmored(signature),
        publicKeys: (await openpgp.key.readArmored(publicKey)).keys
    });
    t.true(verified.signatures[0].valid);
});

test('generate a valid PGP signature for the provided commit string', async t => {
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

    // Generate a signature from an already git-computed commit string
    const commit: CommitPayload = {
        message: 'Commit message',
        tree: 'tree-sha',
        parents: ['parent-sha'],
        author: {
            ...user,
            date: new Date().toISOString()
        }
    };

    const commitStr = commitToString(commit);
    const signature = await createSignature(commitStr, privateKey, passphrase);
    t.true(signature.startsWith('-----BEGIN PGP SIGNATURE-----'));

    // Verify signature
    const verified = await openpgp.verify({
        message: openpgp.message.fromText(commitToString(commit)),
        signature: await openpgp.signature.readArmored(signature),
        publicKeys: (await openpgp.key.readArmored(publicKey)).keys
    });
    t.true(verified.signatures[0].valid);
});
