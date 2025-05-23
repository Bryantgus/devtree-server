import { Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/authpassword"
import slugify from "slugify"
import { validationResult } from "express-validator"
import { generateJWT } from "../utils/jwt"
import jwt from "jsonwebtoken"
import formidable from 'formidable'
import cloudinary from '../config/cloudinary'
import { v4 as uuid } from 'uuid'


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
    console.log();
    
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
    return
}

export const getUser = async (req: Request, res: Response) => {
    res.json(req.user)
    return          
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { description, links } = req.body
        const handle = slugify(req.body.handle, '')
        const handleExists = await User.findOne({handle})
        if (handleExists && handleExists.email !== req.user.email) {
            const error = new Error ("Un usuario con ese email ya esta registrado")
            res.status(409).json({error: error.message})
            return
        }
        
        
        //Actualizar usuario
        req.user.description = description
        req.user.handle = handle
        req.user.links = links
        await req.user.save()
        res.send('Perfil Actualizado Correctamente')
        console.log(links);

        
    } catch (e) {
        const error = new Error('Hubo un error')
        res.status(500).json({error: error.message})
    }
}


export const uploadImage = async (req: Request, res: Response) => {
    const form = formidable({multiples: false})
    try {
        form.parse(req, (error, fields, files) => {
            cloudinary.uploader.upload(files.file[0].filepath, { public_id: uuid()}, async function (error, result) {
                if(error) {
                    const error = new Error('Hubo un error al subir la imagen')
                    res.status(500).json({error: error.message})
                    return
                }
                if(result) {
                    req.user.image = result.secure_url
                    await req.user.save()
                    res.json({image: result.secure_url})
                }
            })
        })
    } catch (e) {
        const error = new Error('Hubo un error')
        res.status(500).json({error: error.message})
        return
    }

}

export const getUserByHandle = async (req: Request, res: Response) => {
    try {
        const { handle } = req.params
        const user = await User.findOne({handle}).select('-_id -__v -email -password')
        if(!user) {
            const error = new Error('El Usuario no existe')
            res.status(404).json({error: error.message})
            return 
        }
        res.json(user)

    } catch (e) {
        const error = new Error('Hubo un error')
        res.status(500).json({error: error.message})
        return
    }
}

export const searchByHandle = async (req: Request, res: Response) => {

    try {
        const { handle } = req.body
        const userExists = await User.findOne({handle})
        if(userExists) {
            const error = new Error(`${handle} ya esta registrado`)
            res.status(409).json({error: error.message})
            return
        }
        res.send(`${handle} esta disponible`)
        
    } catch (e) {
        const error = new Error('Hubo un error')
        res.status(500).json({error: error.message})
        return
    }

}
