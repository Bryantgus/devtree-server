import { Router } from "express";
import { body } from "express-validator";
import { createAccount, getUser, login, updateProfile, uploadImage } from "./handlers";
import { handleInputErrors } from "./middleware/validation";
import { authenticate } from "./middleware/auth";

const router = Router();

router.post("/auth/register",

  body("handle")
    .notEmpty()
    .withMessage("El handle es obligatorio"),

  body("name")
  .notEmpty()
  .withMessage("El nombre es obligatorio"),

  body("email")
    .isEmail()
    .withMessage("E-Mail no valido"),

  body("password")
    .isLength({min:8})
    .withMessage("Tu Contraseña debe tener almenos 8 caracteres"),
  handleInputErrors,
  createAccount
);

router.post('/auth/login',
  
  body("email")
    .isEmail()
    .withMessage("E-Mail no valido"),

  body("password")
    .notEmpty()
    .withMessage("El Password es obligatorio"),
  handleInputErrors,
  login
)

router.get('/user', authenticate, getUser)

router.patch('/user', 
  body("handle")
    .notEmpty()
    .withMessage("El handle es obligatorio"),

  body("description")
  .notEmpty()
  .withMessage("La descripcion es obligatorio"),
  handleInputErrors,
  authenticate, 
  updateProfile
)

router.post('/user/image', authenticate, uploadImage)

export default router;
