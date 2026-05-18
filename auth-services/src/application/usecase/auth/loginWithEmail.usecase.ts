import type IUsecase from "@domain/usecase/usecase.entities.js";
import { BusinessError, NotFoundError } from "@domain/errors/AppError.js";
import type ICredentialRepositories from "@domain/repositories/ICredentials.repository.js";
import type IHashService from "@domain/service/hash.service.js";
import type ITokenService from "@domain/service/token.service.js";
import type ICache from "@domain/cache/cache.entities.js";
import type IHttp from "@domain/http/Ihttp.http.js";
export default class LoginWithEmailUseCase implements IUsecase<{
  token: string;
  refresh_token: string;
}> {
  private repository: ICredentialRepositories;
  private hashService: IHashService;
  private tokenService: ITokenService;
  private http: IHttp;
  private cache: ICache;
  constructor(
    repository: ICredentialRepositories,
    hashService: IHashService,
    tokenService: ITokenService,
    http: IHttp,
    cache: ICache,
  ) {
    this.repository = repository;
    this.hashService = hashService;
    this.tokenService = tokenService;
    this.http = http;
    this.cache = cache;
  }

  async execute(loginForm: {
    email: string;
    password: string;
  }): Promise<{ token: string; refresh_token: string }> {
    const auth = await this.repository.findByEmail(loginForm.email);

    if (!auth || !auth.info.password_hash) {
      throw new NotFoundError("NOT FOUND EMAIL OR NOT MATCH PASSWORD");
    }

    const isMatch = await this.hashService.compare(
      loginForm.password,
      auth?.info.password_hash,
    );

    if (!isMatch) {
      throw new BusinessError("EMAIL_OR_PASSWORD_INCORRECT");
    }

    const user = await this.http.get<{
      id: string;
      auth_id: string;
    }>(`/auth/${auth.info.id}`);

    const refreshToken = await this.tokenService.generateToken(
      {
        id: user.id,
      },
      "1d",
    );

    await this.cache.set(
      `refreshToken:${user.id}`,
      refreshToken,
      60 * 60 * 24,
    );

    const token = await this.tokenService.generateToken(
      {
        email: loginForm.email,
        id: user.id,
        auth_id: auth.info.id,
      },
      "1h",
    );

    return {
      token: token,
      refresh_token: refreshToken,
    };
  }
}
