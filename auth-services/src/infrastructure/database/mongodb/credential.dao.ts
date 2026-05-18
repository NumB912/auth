
import type ICredentialRepositories from "@domain/repositories/ICredentials.repository.js";
import type Provider from "@domain/type/provider.type.js";
import credentialsModel from "./model/credentials.model.js";
import Credential from "@domain/model/Credential.model.js";

export default class CredentialDao implements ICredentialRepositories {
  private toDomain(doc: any): Credential {
    return new Credential({
      id: doc.id,
      email: doc.email ?? "",
      oauth_provider: doc.oauth_provider as Provider,
      password_hash: doc.password_hash ?? undefined,
      oauth_id: doc.oauth_id ?? undefined,
    });
  }

  async createCredential(credential: Credential): Promise<string> {
    const credentialCreated = await credentialsModel.create({
      id: credential.info.id,
      email: credential.info.email ?? null,
      oauth_provider: credential.info.oauth_provider,
      password_hash: credential.info.password_hash ?? null,
      oauth_id: credential.info.oauth_id ?? null,
      created_at: credential.info.created_at,
    });

    return (credentialCreated.id.toString())
  }

  async deleteCredential(id: string): Promise<void> {
    await credentialsModel.deleteOne({ id: id });
  }

  async findByEmail(email: string): Promise<Credential | null> {
    const findCredential = await credentialsModel.findOne({ email: email });
    return findCredential?this.toDomain(findCredential):null;
  }

  async findById(id: string): Promise<Credential | null> {
    const findCredential = await credentialsModel.findOne({ id: id });
    return this.toDomain(findCredential);
  }

  async findByOAuthId(oauthId: string): Promise<Credential | null> {
    const findCredential = await credentialsModel.findOne({
      oauth_id: oauthId,
    });

    return this.toDomain(findCredential);
  }

  async updatePasswordHash(id: string, passwordHash: string): Promise<void> {
    await credentialsModel.updateOne(
      { id: id },
      { password_hash: passwordHash },
    );
  }
}
