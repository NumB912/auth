import type FindAll from "@application/usecase/user/findAll.usecase.js";
import type CreateUser from "@application/usecase/user/createUser.usecase.js";
import User from "@domain/interface/user.entities.js";
import type { IRequest } from "@domain/request/request.entities.js";
import type UpdateUser from "@application/usecase/user/updateUser.usecase.js";
import type { Ivalidate } from "@domain/validate/validate.entities.js";
import type {
  updateUserPayload,
  createUserPayload,
} from "@domain/type/payload.type.js";
import type FindById from "@application/usecase/user/findById.usecase.js";
import type DeleteUser from "@application/usecase/user/deleteUser.usecase.js";
import { ValidationError } from "@domain/errors/AppError.js";
import type FindByAuthId from "@application/usecase/user/findByAuthId.usecase.js";

export default class UserController {
  private findByIdUsecase: FindById;
  private findAllUseCase: FindAll;
  private findByAuthIdUseCase: FindByAuthId;

  private createUserUseCase: CreateUser;
  private updateUserUseCase: UpdateUser;
  private deleteUserUseCase: DeleteUser;

  private updateUserValidate: Ivalidate<updateUserPayload>;
  private createUserValidate: Ivalidate<createUserPayload>;
  constructor(
    findByIdUseCase: FindById,
    findAllUseCase: FindAll,
    findByAuthIdUseCase: FindByAuthId,

    createUserUseCase: CreateUser,
    updateUserUseCase: UpdateUser,
    deleteUserUseCase: DeleteUser,

    updateUserValidate: Ivalidate<updateUserPayload>,
    createUserValidate: Ivalidate<createUserPayload>,
  ) {
    this.findByIdUsecase = findByIdUseCase;
    this.findAllUseCase = findAllUseCase;
    this.findByAuthIdUseCase = findByAuthIdUseCase;

    this.createUserUseCase = createUserUseCase;
    this.updateUserUseCase = updateUserUseCase;
    this.deleteUserUseCase = deleteUserUseCase;

    this.updateUserValidate = updateUserValidate;
    this.createUserValidate = createUserValidate;
  }

  public async findByAuthId(req: IRequest) {
    const { auth_id } = req.params;

    if (!auth_id) {
      throw new ValidationError(["ID rỗng"]);
    }

    const user = await this.findByAuthIdUseCase.execute(auth_id as string);
    return user;
  }

  public async findById(req: IRequest) {
    const { id } = req.params;
    if (!id) {
      throw new ValidationError(["ID rỗng"]);
    }

    const user = await this.findByIdUsecase.execute(id as string);
    return { user };
  }

  public async update(req: IRequest) {
    const { id } = req.params;
    const { data, isSuccess, errors } = this.updateUserValidate.validate(
      req.body,
    );

    if (!isSuccess) {
      throw new ValidationError(errors as string[]);
    }

    const user = await this.updateUserUseCase.execute(
      id as string,
      data as Partial<User>,
    );

    return { user };
  }

  public async findAll(req: IRequest) {
    const users = await this.findAllUseCase.execute();
    return { users };
  }

  public async delete(req: IRequest) {
    const { id } = req.params;

    if (!id) {
      throw new ValidationError(["ID rỗng"]);
    }

    const deleteUser = await this.deleteUserUseCase.execute(id as string);

    return {
      deleteUser,
    };
  }

  public async create(req: IRequest) {
    const { data, isSuccess, errors } = this.createUserValidate.validate(
      req.body,
    );

    if (!isSuccess || !data) {
      throw new ValidationError(errors as string[]);
    }

    const createUser = await this.createUserUseCase.execute(data);

    return {
      createUser,
    };
  }
}
