import create from "@src/core/domains/auth/actions/create";
import login from "@src/core/domains/auth/actions/login";
import revoke from "@src/core/domains/auth/actions/revoke";
import user from "@src/core/domains/auth/actions/user";
import authConsts from "@src/core/domains/auth/consts/authConsts";
import { authorize } from "@src/core/domains/express/middleware/authorize";
import Route from "@src/core/domains/express/routing/Route";
import RouteGroup from "@src/core/domains/express/routing/RouteGroup";
import { IRoute } from "../../express/interfaces/IRoute";
import update from "../actions/update";
import { IAuthConfig } from "../interfaces/IAuthConfig";

export const routes = (config: IAuthConfig): IRoute[] => {
    return RouteGroup([
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
            validator: config.validators.createUser,
            validateBeforeAction: true
        }),
        Route({
            name: authConsts.routes.authUpdate,
            method: 'patch',
            path: '/api/auth/user',
            action: update,
            middlewares: [authorize()],
            validator: config.validators.updateUser,
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
}

export default routes;