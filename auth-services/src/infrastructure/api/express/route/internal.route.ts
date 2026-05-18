import InternalController from '@adapter/controller/internal.controller.js'
import FindByIdInternalUsecase from '@application/usecase/internal/findById.usecase.js'
import type { IRequest } from '@domain/request/request.entities.js'
import CredentialDao from '@infrastructure/database/mongodb/credential.dao.js'
import asyncHandler from '@infrastructure/error/asyncHandler.error.js'
import express, { type Request, type Response } from 'express'
const router = express().router

const repository = new CredentialDao()
const findByIdInternalUC = new FindByIdInternalUsecase({
    repository:repository
})
const internalAuthController = new InternalController(findByIdInternalUC)

router.get('/:id',asyncHandler(async (req:Request,res:Response)=>{
    const params = req.params 
    const auth = await internalAuthController.findById({
        params:params
    } as IRequest)
    
    res.status(200).json(auth)
}))

export default router