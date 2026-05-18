import type { IUserRepository } from "@domain/repositories/user.repository.js";
import User from "../../../domain/interface/user.entities.js";
import type IUsecase from "@domain/usecase/usecase.entities.js";
import type { createUserPayload } from "@domain/type/payload.type.js";
import { BusinessError } from "@domain/errors/AppError.js";

export default class CreateUser implements IUsecase<User> {
  private repository: IUserRepository;

  constructor(repository: IUserRepository) {
    this.repository = repository;
  }

  async execute(user: createUserPayload): Promise<User> {

    const createUser = await this.repository.create(user as Partial<User>);

    return createUser;
  }
}
