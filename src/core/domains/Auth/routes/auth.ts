import create from "@src/core/domains/Auth/actions/create";
import login from "@src/core/domains/Auth/actions/login";
import user from "@src/core/domains/Auth/actions/user";
import authConsts from "@src/core/domains/Auth/consts/authConsts";
import { authorize } from "@src/core/http/middleware/authorize";
import { IRoute } from "@src/core/interfaces/http/IRoute";

const routes: IRoute[] = [
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
