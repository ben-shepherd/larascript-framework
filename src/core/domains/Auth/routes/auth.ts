import { authorize } from "../../../http/middleware/authorize";
import { IRoute } from "../../../interfaces/IRoute";
import create from "../actions/auth/create";
import login from "../actions/auth/login";
import user from "../actions/auth/user";

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
    },
    {
        name: 'authUser',
        method: 'get',
        path: '/api/auth/user',
        action: user,
        middlewares: [authorize]
    }
]

export default routes;
