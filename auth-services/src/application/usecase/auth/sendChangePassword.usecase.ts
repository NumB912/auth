import type IUsecase from "@domain/usecase/usecase.entities.js";
import { BusinessError, NotFoundError } from "@domain/errors/AppError.js";
import type ITokenService from "@domain/service/token.service.js";
import type IPublisher from "@domain/message/publisher.message.js";
import type IUUID from "@domain/service/uuid.service.js";
import type ICache from "@domain/cache/cache.entities.js";
export default class SendChangePasswordUsecase implements IUsecase<void> {
  private publisher: IPublisher;
  private tokenService: ITokenService;
  private cache: ICache;
  constructor(
    publisher: IPublisher,
    tokenService: ITokenService,
    cache: ICache,
    uuid: IUUID,
  ) {
    this.tokenService = tokenService;
    this.publisher = publisher;
    this.cache = cache;
  }

  async execute(email: string): Promise<void> {
    const existingToken = (await this.cache.get(
      `changePassword:email:${email}`,
    )) as {
      token: string;
      created_at: Date;
    };

    console.log(existingToken)

    if (
      existingToken &&
      new Date().getTime()-new Date(existingToken.created_at).getTime() <= 30 * 1000
    ) {
      throw new BusinessError("WAIT_30_SECONDS");
    }

    if (existingToken) {
      await this.cache.delete(`changePassword:email:${email}`);
      await this.cache.delete(`changePassword:token:${existingToken.token}`);
    }
    const geneToken = await this.tokenService.generateToken({ email }, "15m");

    await this.cache.set(
      `changePassword:email:${email}`,
      { token: geneToken, created_at: new Date() },

      15 * 60 * 1000,
    );
    await this.cache.set(
      `changePassword:token:${geneToken}`,
      { email: email },
      15 * 60 * 1000,
    );
    this.publisher.pub<{ token: string; email: string }>(
      "Change.Password",
      "send.change-pass.password",
      "direct",
      { token: geneToken, email: email },
    );
  }
}
