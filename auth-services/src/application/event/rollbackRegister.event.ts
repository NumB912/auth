import { BusinessError } from "@domain/errors/AppError.js";
import type IConsumer from "@domain/message/consumer.message.js";
import type IPublisher from "@domain/message/publisher.message.js";
import type ICredentialRepositories from "@domain/repositories/ICredentials.repository.js";
import type IUsecase from "@domain/usecase/usecase.entities.js";

class RollbackRegister implements IUsecase<void> {
  private repository: ICredentialRepositories;
  private consumer: IConsumer;
  constructor(repository: ICredentialRepositories, consumer: IConsumer) {
    this.repository = repository;
    this.consumer = consumer;
  }

  async execute(): Promise<void> {
    await this.consumer.sub(
      "exchange.user",
      "error.create-user.auth",
      ["error.create-user.auth"],
      "direct",
      async (event: any) => {
        console.info('[event:user->rollback]: Yêu cầu rollback lại do user lỗi')
        this.repository.deleteCredential(event.auth_id);
        console.info('[complete-rollback]: Hoàn thành rollback tạo credential')
      },
    );

    // throw new BusinessError('Đăng ký không thành công vui lòng thử lại')
  }
}
export default RollbackRegister;
