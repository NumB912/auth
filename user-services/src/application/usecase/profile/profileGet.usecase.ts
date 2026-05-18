import type IUsecase from "@domain/usecase/usecase.entities.js";
import type { IUserRepository } from "@domain/repositories/user.repository.js";
import { BusinessError } from "@domain/errors/AppError.js";
import type IHttp from "@domain/http/Ihttp.http.js";
import type Provider from "@domain/type/provider.type.js";
import type GetProfileResponseDTO from "@domain/DTO/getProfileResponse.DTO.js";
import Entity from "@domain/entities/entity/entity.entities.js";
export default class ProfileGetUsecase
  extends Entity<{
    repository: IUserRepository;
    http: IHttp;
  }>
  implements IUsecase<GetProfileResponseDTO | null>
{
  declare repository: IUserRepository;
  declare http: IHttp;

  async execute(id: string): Promise<GetProfileResponseDTO | null> {
    try {
      const user = await this.repository.findById(id);
      if (!user || !user.info) {
        return null;
      }

      const auth = await this.http.get<{ email: string; provider: Provider }>(
        `/${user.info?.auth_id}`,
      );

      return {
        id: user.info?.id,
        email: auth.email,
        provider: auth.provider,
        firstName: user.info.firstName,
        lastName: user.info.lastName,
        avatar:user.info.avatarUrl??"",
        sex:user.info.sex,
        dateOfBirth:user.info.dateOfBirth?user.info.dateOfBirth:undefined
      };
    } catch (error) {
      console.error("Lỗi trong quá trình lấy dữ liệu", error);
      throw new BusinessError("Lỗi trong quá trình lấy dữ liệu profile");
    }
  }
}
