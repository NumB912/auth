import { BusinessError } from "@domain/errors/AppError.js";
import type IPublisher from "@domain/message/publisher.message.js";
import type ICredentialRepositories from "@domain/repositories/ICredentials.repository.js";
import type IOtpService from "@domain/service/otp.service.js";
import type IUsecase from "@domain/usecase/usecase.entities.js";

export default class SendOtpUsecase implements IUsecase<void> {
  private publisher: IPublisher;
  private otpService: IOtpService;
  private repository: ICredentialRepositories;
  constructor(
    publisher: IPublisher,
    otpService: IOtpService,
    repository: ICredentialRepositories,
  ) {
    this.publisher = publisher;
    this.otpService = otpService;
    this.repository = repository;
  }

  async execute(email: string): Promise<void> {

    const user = await this.repository.findByEmail(email);
    if (user) {
      throw new BusinessError("EMAIL_IS_USED");
    }
    
    const otp = await this.otpService.generateOtp(email);
    await this.publisher.pub<{ email: string; otp: string }>(
      "exchange.email",
      "email.send-otp.auth",
      "direct",
      { email: email, otp: otp },
    );
  }
}
