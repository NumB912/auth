import mongoose from "mongoose";
import DatabaseConfig from "src/config/database.config.js";
class ClientMongoDB {
  private static client: ClientMongoDB;
  private connection: mongoose.Connection;
  private constructor() {
    const uri = `${DatabaseConfig.HOST_DB}:${DatabaseConfig.PORT_DB}/${DatabaseConfig.DATABASE}`
    this.connection = mongoose.createConnection(
      uri,
    );
    console.log(`DB:${uri}`)
    this.connection.on("connected", () => {
      console.log(
        "[MongoDB] đã kết nối tại:",
        uri,
      );
    });

    this.connection.on("error", (err) => {
      console.error("Lỗi kết nối MongoDB:", err);
      process.exit(1);
    });
  }

  public static getInstance(): ClientMongoDB {
    if (!ClientMongoDB.client) {
      ClientMongoDB.client = new ClientMongoDB();
    }
    return ClientMongoDB.client;
  }

  public connect(): mongoose.Connection {
    return this.connection;
  }
}

export default ClientMongoDB.getInstance();
