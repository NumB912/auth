export type updateUserPayload = Partial<
  {
    firstName: string|undefined;
    lastName: string|undefined;
    password: string|undefined;
    comfirmPassword: string|undefined;
  }
>;

export type createUserPayload = {
  firstName:string,
  lastName:string,
  auth_id:string
}

