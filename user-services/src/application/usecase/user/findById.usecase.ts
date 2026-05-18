import type IUsecase from "@domain/usecase/usecase.entities.js";
import type User from "@domain/interface/user.entities.js";
import type { IUserRepository } from "@domain/repositories/user.repository.js";

export default class FindById implements IUsecase<Partial<User> | null> {
  private repository: IUserRepository;

  constructor(repository: IUserRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<Partial<User> | null> {
    
    const user = await this.repository.findById(id);
    return {...user};
  }
}
