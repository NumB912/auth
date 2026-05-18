import type IUsecase from "@domain/usecase/usecase.entities.js";
import { BusinessError, NotFoundError } from "@domain/errors/AppError.js";
import type ICredentialRepositories from "@domain/repositories/ICredentials.repository.js";
import type IHashService from "@domain/service/hash.service.js";
import type ITokenService from "@domain/service/token.service.js";
import type ICache from "@domain/cache/cache.entities.js";
import type IHttp from "@domain/http/Ihttp.http.js";
export default class LogoutUsecase implements IUsecase<boolean> {
  private tokenService: ITokenService;
  private cache: ICache;
  constructor(tokenService: ITokenService, cache: ICache) {
    this.tokenService = tokenService;
    this.cache = cache;
  }

  async execute(logout: {
    refresh_token: string;
    token: string;
  }): Promise<boolean> {
    try {
      const { user_id } = (await this.tokenService.verifyToken(
        logout.refresh_token,
      )) as { user_id: string };

      await this.cache.delete(`refreshToken:${user_id}`);

      return true;
    } catch (error) {
      return false;
    }
  }
}
