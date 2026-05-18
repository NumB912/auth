import User from "@domain/interface/user.entities.js";
import type { IUserRepository } from "@domain/repositories/user.repository.js";
import userModel from "./model/user.model.js";
import { randomUUID } from "crypto";

export default class UserRepository implements IUserRepository {

  toDomain(doc: any): User {
    return new User({
      id: doc.id,
      lastName: doc.lastName ?? "",
      firstName: doc.firstName ?? "",
      auth_id:doc.auth_id,
      avatarUrl: doc.avatarUrl,
      sex:doc.sex ? doc.sex : undefined,
      dateOfBirth:doc.dateOfBirth?doc.dateOfBirth:undefined,
    });
  }

  
  async create(user: Partial<User>): Promise<User> {
    const createdUser = await userModel.create({
      id: randomUUID().toString(),
      ...user,
    });
    return createdUser as unknown as User;
  }

  async findAll(): Promise<Partial<User>[]> {
    const user=await userModel.find().then((users) => {
      return users.map((user) => {
        return this.toDomain(user)
      });
    });

    return user
  }

  async findByAuthId(auth_id: string): Promise<Partial<User> | null> {
    const user = await userModel.findOne({ auth_id: auth_id });

    if (!user) {
      return null;
    }
    return user?this.toDomain(user):null
  }

  async findById(id: string): Promise<Partial<User> | null> {
    const user = await userModel.findOne({ id: id });
    if (!user) {
      return null;
    }

    return this.toDomain(user)
  }

  async update(id: string, user: Partial<User>): Promise<boolean> {
    const cleanObj = Object.fromEntries(
      Object.entries(user).filter((item) => item[1] !== undefined),
    );

    const result = await userModel.updateOne({ id: id }, { $set: cleanObj });
    return result.modifiedCount > 0;
  }

  async delete(id: string): Promise<boolean> {
    const result = await userModel.deleteOne({ id: id });
    return result.deletedCount > 0;
  }
}
