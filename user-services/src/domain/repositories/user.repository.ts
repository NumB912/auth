import User from "../interface/user.entities.js"

export interface IUserRepository {
    create(payload: Partial<User>):Promise<User>
    delete(id:string):Promise<boolean>
    findById(id:string):Promise<Partial<User> | null>
    findByAuthId(auth_id:string):Promise<Partial<User>|null>
    findAll():Promise<Partial<User>[]>
    update(id:string, payload: Partial<User>):Promise<boolean>
}