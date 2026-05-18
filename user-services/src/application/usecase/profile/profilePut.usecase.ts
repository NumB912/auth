import type { IUserRepository } from "@domain/repositories/user.repository.js";
import User from "../../../domain/interface/user.entities.js";
import type IUsecase from "@domain/usecase/usecase.entities.js";
import { AppError, BusinessError } from "@domain/errors/AppError.js";
import Entity from "@domain/entities/entity/entity.entities.js";
import type { PutProfile } from "@domain/DTO/putProfile.DTO.js";

export default class ProfileUpdateUsecase
  extends Entity<{
    repository: IUserRepository;
  }>
  implements IUsecase<Boolean>
{
  declare repository: IUserRepository;

  async execute(id: string, data: PutProfile): Promise<boolean> {
    const isUserExist = await this.repository.findById(id);

    if (!isUserExist) {
      throw new AppError("USER_NOT_FOUND","Không tìm thấy người dùng",401);
    }

    const updatedUser = await this.repository.update(id, {
      ...data,
    } as Partial<User>);
    return updatedUser;
  }
}
