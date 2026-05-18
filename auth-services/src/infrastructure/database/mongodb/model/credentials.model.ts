import mongoose from "mongoose";
import clientMongodb from "../client.mongodb.js";
const CredentialSchema = new mongoose.Schema({
  id: { type: String, unique: true, require: true },
  password_hash: { type: String, option: true },
  email: { type: String, require: true },
  oauth_provider: { type: String, enum: ["email", "google"], default: "email" },
  oauth_id: { type: String, option: true, require: true },
  created_at: { type: Date, default: Date.now },
});

const connection = clientMongodb.connect();

export default connection.model("Credential", CredentialSchema);
