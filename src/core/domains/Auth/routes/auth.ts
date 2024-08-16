import create from "@src/core/domains/auth/actions/create";
import login from "@src/core/domains/auth/actions/login";
import revoke from "@src/core/domains/auth/actions/revoke";
import user from "@src/core/domains/auth/actions/user";
import authConsts from "@src/core/domains/auth/consts/authConsts";
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
    },
    {
        name: authConsts.routes.authRevoke,
        method: 'post',
        path: '/api/auth/revoke',
        action: revoke,
        middlewares: [authorize()]
    }
]

export default routes;
