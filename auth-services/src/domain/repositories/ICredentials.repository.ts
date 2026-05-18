import type Credential from "@domain/model/Credential.model.js";


export default interface ICredentialRepositories{
    findById(id: string): Promise<Credential | null>;
    findByEmail(email: string): Promise<Credential | null>;
    findByOAuthId(oauthId: string): Promise<Credential | null>;

    createCredential(credential: Credential): Promise<string>;
    updatePasswordHash(id: string, passwordHash: string): Promise<void>;
    deleteCredential(id: string): Promise<void>;
}