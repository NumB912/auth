import type IUsecase from "@domain/usecase/usecase.entities.js";
import { BusinessError } from "@domain/errors/AppError.js";
import type ICredentialRepositories from "@domain/repositories/ICredentials.repository.js";
import Provider from "@domain/type/provider.type.js";
import type IHashService from "@domain/service/hash.service.js";
import type IUUID from "@domain/service/uuid.service.js";
import type IHttp from "@domain/http/Ihttp.http.js";
import Credential from "@domain/model/Credential.model.js";
export default class RegisterEmailUsecase implements IUsecase<void> {
  private repository: ICredentialRepositories;
  private hashService: IHashService;
  private uuidService: IUUID;
  private http:IHttp;
  constructor(
    repository: ICredentialRepositories,
    hashService: IHashService,
    uuidService: IUUID,
    http: IHttp,
  ) {
    this.repository = repository;
    this.hashService = hashService;
    this.uuidService = uuidService;
    this.http = http
  }

  async execute(registerForm: {
    firstName: string;
    password: string;
    lastName: string;
    email: string;
  }): Promise<void> {
    const user = await this.repository.findByEmail(registerForm.email);
    if (user) {
      throw new BusinessError("USER_EXIST");
    }

    const [passwordHash, uuid] = await Promise.all([
      this.hashService.hash(registerForm.password),
      this.uuidService.randomUUID(),
    ]);

    const auth_id = await this.repository.createCredential(
      new Credential({
        id: uuid,
        email: registerForm.email,
        oauth_provider: Provider.EMAIL,
        password_hash: passwordHash,
      }),
    );

    try {

      await this.http.post('/',{
        auth_id:auth_id,
        firstName:registerForm.firstName,
        lastName:registerForm.lastName
      })
    } catch (error) {
      await this.repository.deleteCredential(auth_id)
      console.error('[rollback-credential] lỗi trong quá trình gửi tin -> roll-back lại dữ liệu')
      throw new BusinessError('Lỗi trong quá trình gửi tin cho userService')
    }
  }
}
