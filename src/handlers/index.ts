import { Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/authpassword"
import slugify from "slugify"
import { validationResult } from "express-validator"
import { generateJWT } from "../utils/jw"



export const createAccount = async(req: Request, res: Response) => {

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

export const login = async (req: Request, res: Response) => {

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404).json({ error: "El Usuario no existe" });
        return;
    }

    const isPasswordCorrect = await checkPassword(password, user.password);
    if (!isPasswordCorrect) {
        res.status(404).json({ error: "La Contraseña es incorrecta" });
        return;
    }

    const token = generateJWT({user})
    res.send(token)   
}

export const getUser = async (req: Request, res: Response) => {
    const bearer = req.headers.authorization
    
    if (!bearer) {
        const error = new Error('No Autorizado')
        res.status(401).json({error: error.message})
        return    
    }

    const [, token] = bearer.split('')
    
}
