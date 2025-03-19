import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URI)
        const url2 = `${connection.host}:${connection.port}`
        console.log("Mongoose Conectado en ", url2)
    
        
    } catch (error) {
        console.log(error);
        
    }
}