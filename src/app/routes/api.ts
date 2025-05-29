import ExampleController from "@src/app/controllers/ExampleController"
import AuthorizeMiddleware from "@src/core/domains/auth/middleware/AuthorizeMiddleware"
import Route from "@src/core/domains/http/router/Route"

import LoginController from "../controllers/auth/LoginController"
import ClearAvatarController from "../controllers/auth/profile/ClearAvatarController"
import GetProfileController from "../controllers/auth/profile/GetProfileController"
import UpdateProfileController from "../controllers/auth/profile/UpdateProfileController"
import UpdaterAvatarController from "../controllers/auth/profile/UpdaterAvatarController"
import UpdateAvatarValidator from "../validators/UpdateAvatarValidator"
import UpdateProfileValidator from "../validators/UpdateProfileValidator"


export default Route.group(router => {

    router.get('/example', [ExampleController, 'example'])

    // Auth routes
    router.post('auth/login', LoginController)

    // Profile Routes
    router.group({
        middlewares: [AuthorizeMiddleware]
    }, (router => {

        router.get('auth/profile', GetProfileController)

        router.patch('auth/profile', UpdateProfileController, {
            validator: UpdateProfileValidator
        })

        router.post('auth/profile/avatar', UpdaterAvatarController, {
            validator: UpdateAvatarValidator
        })
        router.delete('auth/profile/clear-avatar', ClearAvatarController)
    }))
    
})
