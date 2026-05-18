import UserRepository from "@infrastructure/database/mongodb/user.dao.js";
import express, { type Request, type Response } from "express";
import type { IRequest } from "@domain/request/request.entities.js";
import asyncHandler from "@infrastructure/error/asyncHandler.error.js";
import ProfileUpdateUsecase from "@application/usecase/profile/profilePut.usecase.js";
import ProfileGetUsecase from "@application/usecase/profile/profileGet.usecase.js";
import { ProfileController } from "@adapter/controller/profile.controller.js";
import { identityMiddleware } from "../middleware/indentify.middleware.js";
import HttpClient from "@infrastructure/http/axio/axio.http.js";
import ProfileChangeAvatarUsecase from "@application/usecase/profile/profileChangeAvatar.usecase.js";
import upload from "@infrastructure/service/multer/multer.service.js";
import type IUpload from "@domain/interface/upload.interface.js";
const repository = new UserRepository();
const http = new HttpClient("http://service-3001:3001/internal/auth");
const httpPhoto = new HttpClient("http://file-services:3008")
const getProfile = new ProfileGetUsecase({
  http: http,
  repository: repository,
});
const putProfile = new ProfileUpdateUsecase({
  repository: repository,
});

const ChangeAvartar = new ProfileChangeAvatarUsecase(repository, httpPhoto);
const profileController = new ProfileController(getProfile, putProfile,ChangeAvartar);
const router = express.Router();
router.put(
  "/me",
  identityMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;
    const { id } = req.user as { id: string };
    console.log(id)
    const updateUser = await profileController.put({
      body: { ...body, id: id },
    } as IRequest);

    return res.status(200).json(updateUser);
  }),
);

router.get(
  "/me",
  identityMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const data = req.user as { id: string };
    console.log(data.id)
    const result = await profileController.get({
      body: { id: data.id },
    } as IRequest);
    return res.status(200).json({ message:"Thành công thay đổi thông tin",result:result});
  }),
);

router.post("/photo", identityMiddleware, upload.single("file"), asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.user as { id: string }
  if (!req.file) return res.status(400).json({ error: "Không tìm thấy file" })

  const file:IUpload = {
    buffer:req.file.buffer,
    mimeType:req.file.mimetype,
    originalName:req.file.originalname,
    size:req.file.size
  }

  await profileController.changeAvatar({
    body: { id, file }
  } as IRequest)


  return res.status(200).json({ message: "Avatar updated successfully" })
}))

export default router;
