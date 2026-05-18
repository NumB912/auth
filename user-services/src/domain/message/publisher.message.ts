import {type typePublish} from "@domain/type/message.type.js"

export default interface IPublisher{
    pub<T>(exchangeName:string,routingkey:string,type:typePublish,event:T):Promise<void>
    close():Promise<void>
}