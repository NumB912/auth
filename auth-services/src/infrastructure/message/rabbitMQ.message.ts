import amqplib, { type Channel, type ChannelModel } from "amqplib";
class RabbitMQ {
  private static instance: RabbitMQ;
  private channel: Channel | null = null;
  private connection: ChannelModel | null = null;
  private connecting: Promise<Channel> | null = null;

  private constructor() {}

  public static getInstance(): RabbitMQ {
    if (!RabbitMQ.instance) {
      RabbitMQ.instance = new RabbitMQ();
    }
    return RabbitMQ.instance;
  }

  public async getChannel(): Promise<Channel> {
    if (this.channel) return this.channel;
    if (this.connecting) return this.connecting;
    this.connecting = this.createChannel();

    try {
      this.channel = await this.connecting;
      return this.channel;
    } finally {
      this.connecting = null;
    }
  }

  private async createChannel(): Promise<Channel> {
    this.connection = await amqplib.connect(`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`);

    this.connection.on("error", (err) => {
      console.error("[RabbitMQ] Lỗi kết nối:", err.message);
    });

    this.connection.on("close", async () => {
      console.warn("[RabbitMQ] Mất kết nối — đang reconnect...");
      this.connection = null;
      this.channel = null;
      await new Promise((r) => setTimeout(r, 3000));
      await this.getChannel().catch((err) =>
        console.error("[RabbitMQ] Reconnect thất bại:", err.message),
      );
    });

    const channel = await this.connection.createChannel();

    channel.on("error", (err) => {
      console.error("[RabbitMQ] Channel error:", err.message);
      this.channel = null;
    });

    channel.on("close", () => {
      console.warn("[RabbitMQ] Channel đóng");
      this.channel = null;
    });

    console.log("[RabbitMQ] Kết nối thành công");
    return channel;
  }

  public async close(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
    this.channel = null;
    this.connection = null;
  }
}

export default RabbitMQ;
