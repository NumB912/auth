export default interface IHttp{
    get<T>(url:string):Promise<T>
    post<T>(url:string,body:unknown,config?:unknown):Promise<T>
    put<T>(url:string,body:unknown,config?:unknown):Promise<T>
    del<T>(url:string,body:unknown,config?:unknown):Promise<T>
    upload<T>(url:string,body:unknown,config?:unknown,fields?:Record<string,string>):Promise<T>
} 