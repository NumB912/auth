import mongoose from "mongoose";
import clientMongodb from "../client.mongodb.js";

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  auth_id: { type: String, unique: true, required: true },
  sex:{type:String, required:false,default:"other"},
  avatarUrl: { type: String, required: false },
  dateOfBirth:{type:Date,require:false},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const connection = clientMongodb.connect();
export default connection.model("User", userSchema);
