import { CorsOptions } from 'cors';

export const corsConfig: CorsOptions = {
    origin: function(origin, callback) {
        const allowedBaseDomain = 'netlify.app';

        // Permitir sin origin (ej: Postman) si se pasa el flag
        const allowUndefined = process.argv.includes('--api');

        console.log('🌐 Origin recibido:', origin);

        if (
            (origin && origin.includes(allowedBaseDomain)) ||
            (allowUndefined && origin === undefined)
        ) {
            callback(null, true);
        } else {
            callback(new Error('Error de CORS'));
        }
    },
    credentials: true,
};
