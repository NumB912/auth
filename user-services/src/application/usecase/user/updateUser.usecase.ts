import type { IUserRepository } from "@domain/repositories/user.repository.js";
import User from "../../../domain/interface/user.entities.js";
import type IUsecase from "@domain/usecase/usecase.entities.js";
import type {
  Ivalidate,
  IValidationResult,
} from "@domain/validate/validate.entities.js";
import { BusinessError } from "@domain/errors/AppError.js";

export default class UpdateUser implements IUsecase<Boolean> {
  private repository: IUserRepository;
  constructor(repository: IUserRepository) {
    this.repository = repository;
  }

  async execute(id: string, payload: Partial<User>): Promise<boolean> {
    const isUserExist = await this.repository.findById(id)

    if(!isUserExist){
      throw new BusinessError('USER_NOT_FOUND')
    }

    const updatedUser = await this.repository.update(id, payload);
    return updatedUser;
  }
}
