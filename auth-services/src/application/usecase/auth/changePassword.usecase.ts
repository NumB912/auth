import type IUsecase from "@domain/usecase/usecase.entities.js";
import { BusinessError, NotFoundError } from "@domain/errors/AppError.js";
import type ICredentialRepositories from "@domain/repositories/ICredentials.repository.js";
import type IHashService from "@domain/service/hash.service.js";
import type ITokenService from "@domain/service/token.service.js";
import type ICache from "@domain/cache/cache.entities.js";
export default class ChangePasswordUsecase implements IUsecase<void> {
  private tokenService: ITokenService;
  private cache: ICache;
  private repository: ICredentialRepositories;
  private hashService: IHashService;
  constructor(
    repository: ICredentialRepositories,
    tokenService: ITokenService,
    hashService: IHashService,
    cache: ICache,
  ) {
    this.tokenService = tokenService;
    this.cache = cache;
    this.repository = repository;
    this.hashService = hashService;
  }

  async execute(formChangePassword: {
    email: string;
    password: string;
  }): Promise<void> {
    const payload = (await this.cache.get(
      `changePassword:email:${formChangePassword.email}`,
    )) as { token: string } | null;
    if (!payload?.token) {
      throw new BusinessError("KEY_TIME_OUT");
    }

    const { email } = (await this.tokenService.verifyToken(payload.token)) as {
      email: string;
    };

    await this.cache.delete(`changePassword:email:${formChangePassword.email}`);
    await this.cache.delete(`changePassword:token:${payload.token}`);
    const user = await this.repository.findByEmail(email);
    console.log(user)

    if (!user) {
      throw new BusinessError("USER_NOT_EXIST");
    }

    const passwordHash = await this.hashService.hash(
      formChangePassword.password,
    );

    await this.repository.updatePasswordHash(user.info.id, passwordHash);
  }
}
