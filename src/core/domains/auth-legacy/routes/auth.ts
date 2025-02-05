import create from "@src/core/domains/auth-legacy/actions/create";
import login from "@src/core/domains/auth-legacy/actions/login";
import revoke from "@src/core/domains/auth-legacy/actions/revoke";
import update from "@src/core/domains/auth-legacy/actions/update";
import user from "@src/core/domains/auth-legacy/actions/user";
import { IJwtAuthConfig } from "@src/core/domains/auth-legacy/interfaces/IAuthConfig";
import AuthorizeMiddleware from "@src/core/domains/http/middleware/AuthorizeMiddleware";
import Route from "@src/core/domains/http/router/Route";

/**
 * todo: missing validator
 */
const authRouter = (config: IJwtAuthConfig) => Route.group({
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