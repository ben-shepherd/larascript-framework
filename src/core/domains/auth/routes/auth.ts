import create from "@src/core/domains/auth/actions/create";
import login from "@src/core/domains/auth/actions/login";
import revoke from "@src/core/domains/auth/actions/revoke";
import update from "@src/core/domains/auth/actions/update";
import user from "@src/core/domains/auth/actions/user";
import { IAuthConfig } from "@src/core/domains/auth/interfaces/IAuthConfig";
import AuthorizeMiddleware from "@src/core/domains/http/middleware/AuthorizeMiddleware";
import Route from "@src/core/domains/http/router/Route";

/**
 * todo: missing validator
 */
const authRouter = (config: IAuthConfig) => Route.group({
    prefix: '/auth',
}, (router) => {
    
    router.post('/login', login)

    router.post('/create', create)

    router.patch('/update', update, {
        middlewares: [AuthorizeMiddleware]
    })

    router.get('/user', user, {
        middlewares: [AuthorizeMiddleware]
    })

    router.post('/revoke', revoke, {
        middlewares: [AuthorizeMiddleware]
    })
})

export default authRouter;