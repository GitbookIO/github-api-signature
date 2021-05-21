import test from 'ava';
import { createMessage, readKey, readSignature, verify } from 'openpgp';
import { createSignature } from '../createSignature';
import { generateKeyPair } from '../generateKeyPair';
import { CommitPayload, UserInformations } from '../types';
import { commitToString } from '../utils';

test('generate a valid PGP signature for the provided payload', async t => {
    // Generate a key pair
    const passphrase = 'my secret phrase';
    const rsaBits = 2048;
    const user: UserInformations = {
        name: 'John Doe',
        email: 'ghost@github.com'
    };

    const { publicKey, privateKey } = await generateKeyPair(
        user,
        passphrase,
        'rsa',
        rsaBits
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
    const verified = await verify({
        message: await createMessage({
            text: commitToString(commit)
        }),
        signature: await readSignature({
            armoredSignature: signature
        }),
        publicKeys: await readKey({
            armoredKey: publicKey
        })
    });
    t.true(await verified.signatures[0].verified);
});

test('generate a valid PGP signature for the provided commit string', async t => {
    // Generate a key pair
    const passphrase = 'my secret phrase';
    const rsaBits = 2048;
    const user: UserInformations = {
        name: 'John Doe',
        email: 'ghost@github.com'
    };

    const { publicKey, privateKey } = await generateKeyPair(
        user,
        passphrase,
        'rsa',
        rsaBits
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
    const verified = await verify({
        message: await createMessage({
            text: commitToString(commit)
        }),
        signature: await readSignature({
            armoredSignature: signature
        }),
        publicKeys: await readKey({
            armoredKey: publicKey
        })
    });
    t.true(await verified.signatures[0].verified);
});
