import type IUsecase from "@domain/usecase/usecase.entities.js";
import type { IUserRepository } from "@domain/repositories/user.repository.js";


export default class DeleteUser implements IUsecase<void>{

    private repository:IUserRepository

    constructor(repository:IUserRepository){
        this.repository = repository
    }

    async execute(id:string): Promise<void> {
        await this.repository.delete(id)
    }

}