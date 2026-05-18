import type ProfileChangeAvatarUsecase from "@application/usecase/profile/profileChangeAvatar.usecase.js";
import type ProfileGetUsecase from "@application/usecase/profile/profileGet.usecase.js";
import type ProfileUpdateUsecase from "@application/usecase/profile/profilePut.usecase.js";
import type IUpload from "@domain/interface/upload.interface.js";
import type User from "@domain/interface/user.entities.js";
import type { IRequest } from "@domain/request/request.entities.js";

export class ProfileController {
  private profileGetUsecase: ProfileGetUsecase;
  private profilePutUsecase: ProfileUpdateUsecase;
  private changeAvatarUsecase: ProfileChangeAvatarUsecase;
  constructor(
    profileGetUC: ProfileGetUsecase,
    profilePutUC: ProfileUpdateUsecase,
    changeAvatarUC: ProfileChangeAvatarUsecase
  ) {
    this.profileGetUsecase = profileGetUC;
    this.profilePutUsecase = profilePutUC;
    this.changeAvatarUsecase = changeAvatarUC;
  }

  async get(req: IRequest) {
    const { id } = req.body as { id: string };
    const profile = await this.profileGetUsecase.execute(id);
    return profile;
  }

  async put(req: IRequest) {
    const { id, firstName, lastName,dateOfBirth,sex } = req.body as {
      id: string;
      firstName: string;
      lastName: string;
      sex:"orther"|"female"|"male"
      dateOfBirth:Date
    };

    const profile = await this.profilePutUsecase.execute(id, {
      firstName: firstName,
      lastName: lastName,
      dateOfBirth:dateOfBirth,
      sex:sex
    });

    return profile;
  }

  async changeAvatar(req: IRequest) {
    const { id, file } = req.body as {
      id: string;
      file:IUpload;
    };
    await this.changeAvatarUsecase.execute(id, file);
  }
}
