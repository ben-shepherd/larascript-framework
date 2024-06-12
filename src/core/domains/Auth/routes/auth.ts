import { authorize } from "../../../http/middleware/authorize";
import { Route } from "../../../interfaces/IRoute";
import create from "../actions/create";
import login from "../actions/login";
import user from "../actions/user";
import authConsts from "../consts/authConsts";

const routes: Route[] = [
    {
        name: authConsts.routes.authLogin,
        method: 'post',
        path: '/api/auth/login',
        action: login

    },
    {
        name: authConsts.routes.authCreate,
        method: 'post',
        path: '/api/auth/create',
        action: create
    },
    {
        name: authConsts.routes.authUser,
        method: 'get',
        path: '/api/auth/user',
        action: user,
        middlewares: [authorize()]
    }
]

export default routes;
