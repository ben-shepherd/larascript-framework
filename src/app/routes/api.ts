import ExampleController from "@src/app/controllers/ExampleController"
import AuthorizeMiddleware from "@src/core/domains/auth/middleware/AuthorizeMiddleware"
import Route from "@src/core/domains/http/router/Route"

import ProfileAvatarController from "../controllers/ProfileAvatarController"

export default Route.group(router => {

    router.get('/example', [ExampleController, 'example'])

    // Profile Routes
    router.group({
        middlewares: [AuthorizeMiddleware]
    }, (router => {
        router.post('auth/profile/avatar', ProfileAvatarController)
    }))
    
})
