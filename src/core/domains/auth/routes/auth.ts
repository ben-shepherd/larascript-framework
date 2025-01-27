import create from "@src/core/domains/auth/actions/create";
import login from "@src/core/domains/auth/actions/login";
import revoke from "@src/core/domains/auth/actions/revoke";
import update from "@src/core/domains/auth/actions/update";
import user from "@src/core/domains/auth/actions/user";
import { IAuthConfig } from "@src/core/domains/auth/interfaces/IAuthConfig";
import AuthorizeMiddleware from "@src/core/domains/express/middleware/deprecated/AuthorizeMiddleware";

import Route from "../../express/routing/Route";

/**
 * todo: missing validator
 */
const authRouter = (config: IAuthConfig) => Route.group({
    prefix: '/auth',
    middlewares: [AuthorizeMiddleware]
}, (router) => {
    router.post('/login', login)
    router.post('/create', create)
    router.patch('/update', update)
    router.get('/user', user)
    router.post('/revoke', revoke)
})

export default authRouter;