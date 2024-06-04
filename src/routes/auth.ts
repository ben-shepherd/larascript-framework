import create from '../actions/actions/auth/create';
import login from '../actions/actions/auth/login';
import { IRoute } from '../interfaces/IRoute';

const routes: IRoute[] = [
    {
        name: 'authLogin',
        method: 'post',
        path: '/api/auth/login',
        action: login
    },
    {
        name: 'authCreate',
        method: 'post',
        path: '/api/auth/create',
        action: create
    }
]

export default routes;
