import { Request, Response } from "express"
import User from "../models/User"
import { hashPassword } from "../utils/auth"
import slugify from "slugify"
import { validationResult } from "express-validator"



export const createAccount = async(req: Request, res: Response) => {

    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()})
        return
    }
    
    const { email, password } = req.body

    const userExist = await User.findOne({email})
    if (userExist) {
        const error = new Error ("Un usuario con ese email ya esta registrado")
        res.status(409).json({error: error.message})
        return
    }

    const handle = slugify(req.body.handle, {
        lower: true,
        strict: true,
        trim: true,
        replacement: "_"
    })
    const handleExist = await User.findOne({handle})
    if (handleExist) {
        const error = new Error ("Nombre de usuario no disponible")
        res.status(409).json({error: error.message})
        return
    }

    const user = new User(req.body)
    user.password = await hashPassword(password)    
    user.handle = handle
    await user.save()

    res.status(201).send('Registro Creado Correctamente')
}