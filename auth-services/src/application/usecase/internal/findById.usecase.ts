import Entity from "@domain/entities/entity/entity.entities.js";
import type Credential from "@domain/model/Credential.model.js";
import type ICredentialRepositories from "@domain/repositories/ICredentials.repository.js";
import type { CredentialPayload } from "@domain/type/payload.type.js";
import type IUsecase from "@domain/usecase/usecase.entities.js";

export default class FindByIdInternalUsecase
  extends Entity<{
    repository: ICredentialRepositories;
  }>
  implements
    IUsecase<Omit<
      CredentialPayload,
      "id" | "oauth_id" | "password_hash"
    > | null>
{
  declare repository: ICredentialRepositories;
  async execute(
    id: string,
  ): Promise<Omit<
    CredentialPayload,
    "id" | "oauth_id" | "password_hash"
  > | null> {
    const credentail = await this.repository.findById(id);

    if (!credentail?.info) {
      return null;
    }
    return {
      email: credentail.info.email,
      created_at: credentail.info.created_at,
      provider: credentail.info.oauth_provider,
    };
  }
}
