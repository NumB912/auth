import type { NextFunction, Request, Response } from "express";

function logger(req:Request,res:Response,next:NextFunction){
    console.log(`${new Date().toISOString()} - [IP] ${req.ip} [METHOD] ${req.method} [URL] ${req.url}`)
    next()
}

export default logger