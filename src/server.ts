import express from 'express'
import router from './router'

const app = express()

app.get("/", router)
app.get("/nosotros")

export default app