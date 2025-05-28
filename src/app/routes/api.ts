import ExampleController from "@src/app/controllers/ExampleController"
import AuthorizeMiddleware from "@src/core/domains/auth/middleware/AuthorizeMiddleware"
import Route from "@src/core/domains/http/router/Route"

import LoginController from "../controllers/auth/LoginController"
import GetProfileController from "../controllers/auth/profile/GetProfileController"
import UpdaterAvatarController from "../controllers/auth/profile/UpdaterAvatarController"


export default Route.group(router => {

    router.get('/example', [ExampleController, 'example'])

    // Auth routes
    router.post('auth/login', LoginController)

    // Profile Routes
    router.group({
        middlewares: [AuthorizeMiddleware]
    }, (router => {
        router.get('auth/profile', GetProfileController)
        router.post('auth/profile/avatar', UpdaterAvatarController)
    }))
    
})
