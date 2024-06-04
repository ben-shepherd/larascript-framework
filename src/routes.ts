import { authorize } from './http/middleware/authorize';
import { IRoute } from './interfaces/IRoute';
import create from './actions/api/auth/create';
import login from './actions/api/auth/login';
import user from './actions/api/auth/user';
import health from './actions/api/health';

const routes: IRoute[] = [
    /*
    {
        name: 'example',
        method: 'get',
        path: '/api/example',
        handler: (req, res) => {
            res.send({ message: 'Hello, world!' });
        },
        middlewares: [authorize]
    },
    */
    {
        name: 'health',
        method: 'get',
        path: '/api/health',
        handler: health
    },
    {
        name: 'authLogin',
        method: 'post',
        path: '/api/auth/login',
        handler: login
    },
    {
        name: 'authCreate',
        method: 'post',
        path: '/api/auth/create',
        handler: create
    },
    {
        name: 'getUser',
        method: 'get',
        path: '/api/auth/user',
        handler: user,
        middlewares: [authorize]
    }
]

export default routes;
