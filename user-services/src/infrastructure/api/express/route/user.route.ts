import FindAll from "@application/usecase/user/findAll.usecase.js";
import CreateUser from "@application/usecase/user/createUser.usecase.js";
import UserRepository from "@infrastructure/database/mongodb/user.dao.js";
import express, { type Request, type Response } from "express";
import UserController from "@adapter/controller/user.controller.js";
import UpdateUser from "@application/usecase/user/updateUser.usecase.js";
import type { IRequest } from "@domain/request/request.entities.js";
import updateUserValidate from "@infrastructure/service/validate/zod/user/updateUser.validate.js";
import createUserValidate from "@infrastructure/service/validate/zod/user/createUser.validate.js";
import FindById from "@application/usecase/user/findById.usecase.js";
import DeleteUser from "@application/usecase/user/deleteUser.usecase.js";
import asyncHandler from "@infrastructure/error/asyncHandler.error.js";
import validate from "../middleware/validate.middleware.js";
import FindByAuthId from "@application/usecase/user/findByAuthId.usecase.js";
const repository = new UserRepository();
const findByIdUsecase = new FindById(repository);
const findAllUseCase = new FindAll(repository);
const findByAuthIdUseCase = new FindByAuthId(repository);

const createUserUsecase = new CreateUser(repository);
const updateUserUsecase = new UpdateUser(repository);
const deleteUserUsecase = new DeleteUser(repository);
const userController = new UserController(
  findByIdUsecase,
  findAllUseCase,
  findByAuthIdUseCase,
  createUserUsecase,
  updateUserUsecase,
  deleteUserUsecase,
  updateUserValidate,
  createUserValidate,
);
const router = express.Router();

router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;
    const token = req.headers.authorization;
    const params = req.params;

    const result = await userController.delete({
      token: token as string,
      body,
      params,
    } as IRequest);

    return res.status(200).json(result);
  }),
);

router.get(
  "/auth/:auth_id",
  asyncHandler(async (req: Request, res: Response) => {
    const result = await userController.findByAuthId({
      params: req.params,
    } as IRequest);
    return res.status(200).json(result);
  }),
);

router.post(
  "/",
  validate(createUserValidate),
  asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;
    const params = req.params;
    const createUser = await userController.create({
      body,
      params,
    } as IRequest);
    return res.status(200).json(createUser);
  }),
);

router.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;
    const token = req.headers.authorization;
    const params = req.params;

    const updateUser = await userController.update({
      token: token as string,
      body,
      params,
    } as IRequest);

    return res.status(200).json(updateUser);
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const result = await userController.findById({
      params: req.params,
    } as IRequest);

    return res.status(200).json(result);
  }),
);

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const params = req.params;
    const body = req.body;
    const users = await userController.findAll({
      token: token as string,
      body: body,
      params: params,
    } as IRequest);
    return res.status(200).json(users);
  }),
);

export default router;
