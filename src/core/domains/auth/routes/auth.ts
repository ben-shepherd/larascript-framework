import create from "@src/core/domains/auth/actions/create";
import login from "@src/core/domains/auth/actions/login";
import revoke from "@src/core/domains/auth/actions/revoke";
import update from "@src/core/domains/auth/actions/update";
import user from "@src/core/domains/auth/actions/user";
import authConsts from "@src/core/domains/auth/consts/authConsts";
import { IAuthConfig } from "@src/core/domains/auth/interfaces/IAuthConfig";
import { IRoute } from "@src/core/domains/express/interfaces/IRoute";
import { authorizeMiddleware } from "@src/core/domains/express/middleware/authorizeMiddleware";
import Route from "@src/core/domains/express/routing/Route";
import RouteGroup from "@src/core/domains/express/routing/RouteGroup";

export const routes = (config: IAuthConfig): IRoute[] => {
    return RouteGroup([
        Route({
            name: authConsts.routes.authLogin,
            method: 'post',
            path: '/auth/login',
            action: login 
        }),
        Route({
            name: authConsts.routes.authCreate,
            method: 'post',
            path: '/auth/create',
            action: create,
            validator: config.validators.createUser,
            validateBeforeAction: true
        }),
        Route({
            name: authConsts.routes.authUpdate,
            method: 'patch',
            path: '/auth/user',
            action: update,
            middlewares: [authorizeMiddleware()],
            validator: config.validators.updateUser,
            validateBeforeAction: true
        }),
        Route({
            name: authConsts.routes.authUser,
            method: 'get',
            path: '/auth/user',
            action: user,
            middlewares: [authorizeMiddleware()]
        }),
        Route({
            name: authConsts.routes.authRevoke,
            method: 'post',
            path: '/auth/revoke',
            action: revoke,
            middlewares: [authorizeMiddleware()]
        })
    ])
}

export default routes;