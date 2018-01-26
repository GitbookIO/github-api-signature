# github-api-signature

[![npm version](https://badge.fury.io/js/github-api-signature.svg)](https://badge.fury.io/js/github-api-signature)
[![Build Status](https://travis-ci.org/GitbookIO/github-api-signature.svg?branch=master)](https://travis-ci.org/GitbookIO/github-api-signature)

Node.js signature generator for GitHub API using a PGP key.

## Install

```sh
$ npm i github-api-signature
```

or

```sh
$ yarn add github-api-signature
```

## API

### `generateKeyPair`

This method returns a `Promise` containing two properties `publicKey` and `privateKey` which are both `string`s.

It generates a public and private PGP keys pair that can be used to sign commits with GitHub API using a GitHub user's informations and a passphrase.

The public key should be added to the user's settings. The private key is then used with the `createSignature` method to sign the commit with the `committer` informations extracted from the payload sent to the API.

###### Usage

```js
import { generateKeyPair } from 'github-api-signature';

const passphrase: string = 'my secret phrase';

const user: UserInformations = {
    name: 'Dohn Joe',
    email: 'github@ghost.com'
};

// Optional number of bits for the generated RSA keys pair.
// Defaults to the maximum value 4096.
const numBits = 4096;

generateKeyPair(user, passphrase, numBits)
.then((keyPair: KeyPair) => {
    // keyPair = {
    //     publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----...',
    //     privateKey: '-----BEGIN PGP PRIVATE KEY BLOCK-----...'
    // };

    // Add publicKey to Dohn Joe's GitHub account settings.
    // Use privateKey to create commits signatures for Dohn Joe's as committer.
});
```

###### Type definitions

```js
async function generateKeyPair(
    user: UserInformations,
    passphrase: string,
    numBits?: number = 4096
): Promise<KeyPair> {}

type UserInformations = {
    name: string,
    email: string
};

type KeyPair = {
    publicKey: string,
    privateKey: string
};
```

### `createSignature`

This method returns a `Promise` containing a `string` which is the PGP signature that should be used on the GitHub API to sign your commit with the committer informations.

Use this method with the same payload that you would send to the GitHub API `POST /repos/:owner/:repo/git/commits` endpoint.

To use this method, the `author` argument is **mandatory**, as opposed to the optional argument for the API. This is necessary since we need to generate the commit message string with the same `date` argument as GitHub will do to verify the signature.

The `committer` argument is still optional and will default to the `author` value if omitted.

In the following example, the commit will be signed for `Dohn Joe`. Hence, `privateKey` should be generated using `Dohn Joe`'s informations.

###### Usage

```js
import { createSignature } from 'github-api-signature';

const privateKey: string = `-----BEGIN PGP PRIVATE KEY BLOCK-----

// Private key content //
-----END PGP PRIVATE KEY BLOCK-----`;

const passphrase: string = 'my secret phrase';

const commit: CommitPayload = {
    message: 'Commit message',
    tree: 'tree-sha',
    parents: ['parent-sha'],
    author: {
        name: 'John Doe',
        email: 'ghost@github.com',
        date: '2018-01-01T00:00:00.000Z'
    },
    // Optional committer informations
    // Defaults to <author>
    committer: {
        name: 'Dohn Joe',
        email: 'github@ghost.com',
        date: '2018-01-01T00:00:00.000Z'
    }
};

createSignature(commit, privateKey, passphrase)
.then((signature: string) => {
    // signature = `-----BEGIN PGP SIGNATURE-----
    //
    // // Signature content
    // -----END PGP SIGNATURE-----`;

    const apiPayload = {
        ...commit,
        signature
    };

    // Use signature with GitHub API
    // https://developer.github.com/v3/git/commits/#create-a-commit
    // POST /repos/:owner/:repo/git/commits
});
```

###### Type definitions

```js
async function createSignature(
    commit: CommitPayload,
    privateKey: string,
    passphrase: string
): Promise<string> {}

type UserInformations = {
    name: string,
    email: string
};

type GitHubUser = UserInformations & {
    date: string
};

type CommitPayload = {
    message: string,
    tree: string,
    parents: string[],
    author: GitHubUser,
    committer?: GitHubUser
};
```
