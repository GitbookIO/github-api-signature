/* @flow */

export type UserInformations = {
    name: string,
    email: string
};

export type KeyPair = {
    publicKey: string,
    privateKey: string
};

export type GitHubUser = UserInformations & {
    date: string
};

export type CommitPayload = {
    message: string,
    tree: string,
    parents: string[],
    author: GitHubUser,
    committer?: GitHubUser
};
