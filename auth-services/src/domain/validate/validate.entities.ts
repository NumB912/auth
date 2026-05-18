export interface Ivalidate<T>{
    validate(...args: any[]): IValidationResult<T>;
}

export interface IValidationResult<T> {
    data?: T|undefined;
    errors?: any[]|undefined;
    isSuccess?:boolean
}