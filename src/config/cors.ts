import { CorsOptions} from 'cors'

export const corsConfig: CorsOptions = {
    origin: function(origin, callback) {
        const whiteList = ['https://effortless-blini-cec6a2.netlify.app']

        if(process.argv[2] === '--api') {
            whiteList.push(undefined)
        }
        if(whiteList.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
        
    }
}