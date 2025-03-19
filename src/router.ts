import { Router } from "express";

const router = Router()

router.get('/', (req, res) => {
    res.send("Hello World on TypeScript")
})

router.get('/nosotros', (req, res) => {
    res.send("Hello World on TypeScript")
})

export default router

