import { AppError, BusinessError } from "@domain/errors/AppError.js";
import type IHttp from "@domain/http/Ihttp.http.js";
import type IUpload from "@domain/interface/upload.interface.js";
import type User from "@domain/interface/user.entities.js";
import type IPublisher from "@domain/message/publisher.message.js";
import type { IUserRepository } from "@domain/repositories/user.repository.js";
import type IUsecase from "@domain/usecase/usecase.entities.js";
import SecretInternal from "src/config/internal.config.js";

export default class ProfileChangeAvatarUsecase implements IUsecase<void> {
  private repository: IUserRepository;
  private http: IHttp;
  constructor(repository: IUserRepository, http: IHttp) {
    this.repository = repository;
    this.http = http;
  }

  async execute(id: string, file: IUpload): Promise<void> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new BusinessError("USER_NOT_FOUND");
    }
    const urlAvatarUser = user.info?.avatarUrl;

    const result = await this.http.upload<{ url: string }>(
      "/file",
      file,
      {
        headers: {
          "x-secret-internal": SecretInternal.SECRET_INTERNAL,
        },
      },
      {
        url: `${id}/`,
      },
    ).catch(error=>{
        const errorReponse = error.response
        if(!errorReponse){
          throw new AppError("Internal server","Lỗi không xác định",500)
        }
        throw new AppError(errorReponse.data.code,errorReponse.data.message,errorReponse.status)
    });

    try {
      await this.repository.update(id, {
        avatarUrl: `${id}/${result.url}`,
      } as Partial<User>);
    } catch (error) {
      await this.http.del(
        `/file`,
        { url: `${id}/${result.url}` },
        {
          headers: {
            "x-secret-internal": SecretInternal.SECRET_INTERNAL,
          },
        },
      );
    }

    if (urlAvatarUser) {
      await this.http
        .del(
          `/file`,
          { url: urlAvatarUser },
          {
            headers: {
              "x-secret-internal": SecretInternal.SECRET_INTERNAL,
            },
          },
        )
        .catch((error) => {
          if (error.response.data.code == "INVALID_FILE_TYPE") {
            throw new AppError(
              "INVALID_FILE_TYPE",
              "Gửi không đúng định dạng file",
              400,
            );
          }

          throw new AppError(
            "INTERNAL_SERVER",
            "Lỗi trong quá trình thực thi",
            500,
          );
        });
    }
  }
}
