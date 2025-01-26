import create from "@src/core/domains/auth/actions/create";
import login from "@src/core/domains/auth/actions/login";
import revoke from "@src/core/domains/auth/actions/revoke";
import update from "@src/core/domains/auth/actions/update";
import user from "@src/core/domains/auth/actions/user";
import authConsts from "@src/core/domains/auth/consts/authConsts";
import { IAuthConfig } from "@src/core/domains/auth/interfaces/IAuthConfig";
import { IRouteLegacy } from "@src/core/domains/express/interfaces/IRouteLegacy";
import AuthorizeMiddleware from "@src/core/domains/express/middleware/authorizeMiddleware";
import RouteLegacy from "@src/core/domains/express/routing/RouteLegacy";

import RouteGroupLegacy from "../../express/routing/RouteGroupLegacy";

export const routes = (config: IAuthConfig): IRouteLegacy[] => {
    return RouteGroupLegacy([
        RouteLegacy({
            name: authConsts.routes.authLogin,
            method: 'post',
            path: '/auth/login',
            action: login 
        }),
        RouteLegacy({
            name: authConsts.routes.authCreate,
            method: 'post',
            path: '/auth/create',
            action: create,
            validator: config.validators.createUser,
            validateBeforeAction: true
        }),
        RouteLegacy({
            name: authConsts.routes.authUpdate,
            method: 'patch',
            path: '/auth/user',
            action: update,
            middlewares: [AuthorizeMiddleware],
            validator: config.validators.updateUser,
            validateBeforeAction: true
        }),
        RouteLegacy({
            name: authConsts.routes.authUser,
            method: 'get',
            path: '/auth/user',
            action: user,
            middlewares: [AuthorizeMiddleware]
        }),
        RouteLegacy({
            name: authConsts.routes.authRevoke,
            method: 'post',
            path: '/auth/revoke',
            action: revoke,
            middlewares: [AuthorizeMiddleware]
        })
    ])
}

export default routes;