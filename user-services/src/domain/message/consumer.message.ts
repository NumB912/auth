import type { type } from "@domain/type/message.type.js";

export default interface IConsumer {
  sub<T>(
    exchangeName: string,
    queueName: string,
    routingKeys: string[],
    type: type,
    callback: (event: T) => Promise<void>,
  ): Promise<void>;
  close(): Promise<void>;
}
