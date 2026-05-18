export default interface IHttp{
    get<T>(url:string):Promise<T>
    post<T>(url:string,body:unknown):Promise<T>
    put<T>(url:string,body:unknown):Promise<T>
    del<T>(url:string,body?:unknown):Promise<T>
} 