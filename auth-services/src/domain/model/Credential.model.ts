
import Provider from "@domain/type/provider.type.js";


interface CredentialProp{
  id:string,
  email:string,
  password_hash?:string|undefined,
  oauth_id?:string|undefined,
  oauth_provider:Provider
}

export default class Credential {
  private readonly id: string;
  private readonly email: string;
  private readonly password_hash?: string | undefined;
  private readonly created_at: Date;
  private readonly oauth_id?: string | undefined;
  private readonly oauth_provider: Provider;

  constructor(
   props:CredentialProp
  ) {
    this.id = props.id;
    this.email = props.email;
    this.created_at =new Date();
    this.oauth_provider = props.oauth_provider;
    this.oauth_id = props.oauth_id;
    this.password_hash = props.password_hash;
  }

  
  get info() {
    return {
      id: this.id,
      email: this.email,
      oauth_provider: this.oauth_provider,
      oauth_id: this.oauth_id,
      created_at: this.created_at,
      password_hash: this.password_hash,
    };
  }
}
