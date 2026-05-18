import type IConsumer from "@domain/message/consumer.message.js";
import type IPublisher from "@domain/message/publisher.message.js";
import type User from "@domain/interface/user.entities.js";
import type { IUserRepository } from "@domain/repositories/user.repository.js";
import type IUsecase from "@domain/usecase/usecase.entities.js";

class HandelEventRegisterUserCreate implements IUsecase<void> {
  private repository: IUserRepository;
  private consumer: IConsumer;
  private publisher: IPublisher;
  constructor(
    repository: IUserRepository,
    consumer: IConsumer,
    publisher: IPublisher,
  ) {
    this.repository = repository;
    this.consumer = consumer;
    this.publisher = publisher;
  }

  async execute(): Promise<void> {
    this.consumer.sub(
      "exchange.user",
      "user.create.auth.queue",
      ["user.create-user.auth"],
      "direct",
      async (event: any) => {
        try {
          console.log(event);
          throw new Error("lỗi rồi");
          this.repository.create(event as Partial<User>);
        } catch (error) {
          this.publisher.pub(
            "exchange.user",
            "error.create-user.auth",
            "direct",
            {
              auth_id: event.auth_id,
            },
          );
          console.error(
            "[Rollback-user->auth] Lỗi trong quá trình thực thi tạo thông tin người dùng",
          );
        }
      },
    );
  }
}
export default HandelEventRegisterUserCreate;
