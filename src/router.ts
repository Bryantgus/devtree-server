import { Router } from "express";
import { body } from "express-validator";
import { createAccount } from "./handlers";

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

  createAccount
);

export default router;
