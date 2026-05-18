export interface PutProfile{
    firstName:string,
    lastName:String,
    sex:"female"|"male"|"orther",
    dateOfBirth?:Date|undefined
}