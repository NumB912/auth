import type Provider from "@domain/type/provider.type.js";

export default interface GetProfileResponseDTO{
    id:string,
    email:string,
    firstName:string,
    lastName:string,
    provider:Provider,
    avatar:string,
    sex:string,
    dateOfBirth?:Date|undefined
}