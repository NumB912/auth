import type IUsecase from "@domain/usecase/usecase.entities.js"
import type User from "@domain/interface/user.entities.js"
import type { IUserRepository } from "@domain/repositories/user.repository.js"
import { AppError, BusinessError } from "@domain/errors/AppError.js"


export default class FindAllUser implements IUsecase<Partial<User>[]>{
    private repository:IUserRepository

    constructor(repository:IUserRepository){
        this.repository = repository
    }

    async execute(): Promise<Partial<User>[]> {
        const users = await this.repository.findAll()

        if(users.length == 0 ){
            throw new BusinessError('NOT FOUND USER')
        }

        return users
    }
}