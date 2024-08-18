import create from "@src/core/domains/auth/actions/create";
import login from "@src/core/domains/auth/actions/login";
import revoke from "@src/core/domains/auth/actions/revoke";
import user from "@src/core/domains/auth/actions/user";
import authConsts from "@src/core/domains/auth/consts/authConsts";
import CreateUserValidator from "@src/core/domains/auth/validators/CreateUserValidator";
import { authorize } from "@src/core/domains/express/middleware/authorize";
import Route from "@src/core/domains/express/routing/Route";
import RouteGroup from "@src/core/domains/express/routing/RouteGroup";

const routes = RouteGroup([
    Route({
        name: authConsts.routes.authLogin,
        method: 'post',
        path: '/api/auth/login',
        action: login 
    }),
    Route({
        name: authConsts.routes.authCreate,
        method: 'post',
        path: '/api/auth/create',
        action: create,
        validator: CreateUserValidator,
        validateBeforeAction: true
    }),
    Route({
        name: authConsts.routes.authUser,
        method: 'get',
        path: '/api/auth/user',
        action: user,
        middlewares: [authorize()]
    }),
    Route({
        name: authConsts.routes.authRevoke,
        method: 'post',
        path: '/api/auth/revoke',
        action: revoke,
        middlewares: [authorize()]
    })
])

export default routes;