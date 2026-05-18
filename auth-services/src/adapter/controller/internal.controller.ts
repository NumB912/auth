import type FindByIdInternalUsecase from "@application/usecase/internal/findById.usecase.js";
import type { IRequest } from "@domain/request/request.entities.js";

export default class InternalController {
  private findByIdCredentail: FindByIdInternalUsecase;
  constructor(findByIdCredentail:FindByIdInternalUsecase){
    this.findByIdCredentail = findByIdCredentail
  }
  async findById(req: IRequest) {
    const id = req.params.id as string;
    const auth = await this.findByIdCredentail.execute(id);
    return auth;
  }
}
