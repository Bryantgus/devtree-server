import { Request, Response } from "express"
import User from "../models/User"

export const createAccount = async(req: Request, res: Response) => {

    const {email} = req.body

    const userExist = await User.findOne({email})

    if (userExist) {
        const error = new Error ("El Usuario ya esta registrado")
        res.status(409).json({error: error.message})
        return
    }

    await User.create(req.body)

    res.status(201).send('Registro Creado Correctamente')
}