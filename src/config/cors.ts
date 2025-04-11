import { CorsOptions } from 'cors';

export const corsConfig: CorsOptions = {
    origin: function (_origin, callback) {
        callback(null, true); // Permite cualquier origen
    },
    credentials: true,
};
