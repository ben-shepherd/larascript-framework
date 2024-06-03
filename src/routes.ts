import { authorize } from './http/middleware/authorize';
import { IRoute } from './interfaces/IRoute';
import create from './routes/api/auth/create';
import login from './routes/api/auth/login';
import user from './routes/api/auth/user';
import health from './routes/api/health';

const routes: { [key: string]: IRoute } = {
    /*
    example: {
        method: 'get',
        path: '/api/example',
        handler: (req, res) => {
            res.send({ message: 'Hello, world!' });
        },
        middlewares: [authorize]
    },
    */
    health: {
        method: 'get',
        path: '/api/health',
        handler: health
    },
    authLogin: {
        method: 'post',
        path: '/api/auth/login',
        handler: login
    },
    authCreate: {
        method: 'post',
        path: '/api/auth/create',
        handler: create
    },
    user: {
        method: 'get',
        path: '/api/auth/user',
        handler: user,
        middlewares: [authorize]
    }
};

export default routes;
