
import type ICache from "@domain/cache/cache.entities.js";
import { BusinessError } from "@domain/errors/AppError.js";
import type IHttp from "@domain/http/Ihttp.http.js";
import type ITokenService from "@domain/service/token.service.js";
import type IUsecase from "@domain/usecase/usecase.entities.js";

class RefreshTokenUseCase implements IUsecase<{
    token: string;
  }> {
  private cache: ICache;
  private token: ITokenService;
  private http: IHttp;
  constructor(cache: ICache, token: ITokenService, http: IHttp) {
    this.cache = cache;
    this.token = token;
    this.http = http;
  }

  async execute(refreshToken: string): Promise<{
    token: string;
  }> {
    const { id } = (await this.token.verifyToken(refreshToken)) as {
      id: string;
    };

    if (!id) {
      throw new BusinessError("ERROR_PLS_LOGIN");
    }

    const storedToken = await this.cache.get(`refreshToken:${id}`);
    if (!storedToken) throw new BusinessError("TIME_OUT_REFRESH_KEY");
    if (storedToken !== refreshToken){
        throw new BusinessError("INVALID_REFRESH_TOKEN");
    }

    const user = await this.http.get<{
      id: string;
      firstName: string;
      lastName: string;
      auth_id: string;
    }>(`/${id}`);

    const token = await this.token.generateToken(
      {
        id: id,
        lastName: user.lastName,
        firstName: user.firstName,
        auth_id: user.auth_id,
      },
      "15m",
    );
    return { token: token };
  }
}

export default RefreshTokenUseCase;
