export interface UserInformations {
    name: string;
    email: string;
}

export interface KeyPair {
    publicKey: string;
    privateKey: string;
}

export type GitHubUser = UserInformations & {
    date: string;
};

export interface CommitPayload {
    message: string;
    tree: string;
    parents: string[];
    author: GitHubUser;
    committer?: GitHubUser;
}
